from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from enum import Enum

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["https://mohamedimran.vercel.app"])  # Enable CORS for production frontend
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Telegram bot configuration
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# --- 1. Define the Structure (The "Modern" Way) ---
# Using Enums and Pydantic ensures the AI output is strictly controlled.

class Category(str, Enum):
    INQUIRY = "inquiry"
    SUPPORT = "support"
    SPAM = "spam"
    PARTNERSHIP = "partnership"
    RECRUITMENT = "recruitment" # Added relevant category for you

class Urgency(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class MessageAnalysis(BaseModel):
    category: Category = Field(..., description="The classification of the message.")
    sentiment: str = Field(..., description="Two word sentiment description (e.g., 'Polite Frustration').")
    urgency: Urgency
    summary: str = Field(..., description="A concise 1-sentence summary.")
    is_actionable: bool = Field(..., description="Does this message require a reply?")
    suggested_next_step: str = Field(..., description="What should the receiver do next?")

# --- 2. Optimized Analysis Logic ---

def analyze_message(name, email, message):
    # System instructions set the "Persona" and the rules separate from user data
    sys_instruct = """
    You are an elite Customer Experience AI Agent. 
    Analyze the incoming contact form submission contextually. 
    Be critical about 'Urgency'—only true emergencies or high-value leads are 'High'.
    """

    prompt = f"""
    Analyze this submission:
    ---
    Name: {name}
    Email: {email}
    Message: {message}
    ---
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=sys_instruct,
                response_mime_type="application/json",
                # 3. Pass the Pydantic model to enforce schema
                response_schema=MessageAnalysis 
            )
        )
        
        # In the new SDK, parsed handles the JSON conversion automatically
        return response.parsed 

    except Exception as e:
        print(f"AI Error: {e}")
        return None

def send_telegram_message(name, email, message, analysis=None):
    """Send message to Telegram bot"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("Telegram credentials not configured")
        return False
    
    # Format message for Telegram
    telegram_text = f"""🚀 *New Portfolio Contact!*

👤 *Name:* {name}
📧 *Email:* {email}

💬 *Message:*
{message}

"""
    
    # Add AI analysis if available
    if analysis:
        telegram_text += f"""🤖 *AI Analysis:*
• *Category:* {analysis.category}
• *Sentiment:* {analysis.sentiment}
• *Urgency:* {analysis.urgency}
• *Summary:* {analysis.summary}
• *Actionable:* {'Yes' if analysis.is_actionable else 'No'}
• *Next Step:* {analysis.suggested_next_step}
"""
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': telegram_text,
        'parse_mode': 'Markdown'
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            print("Message sent to Telegram successfully")
            return True
        else:
            print(f"Failed to send Telegram message: {response.status_code}")
            return False
    except Exception as e:
        print(f"Telegram error: {e}")
        return False

@app.route("/contact", methods=["POST"])
def contact():
    try:
        data = request.json
        if not data or not data.get("message"):
            return jsonify({"error": "Message is required"}), 400

        name = data.get("name", "Anonymous")
        email = data.get("email", "No Email")
        message = data.get("message", "")

        # Validate input
        if not message.strip():
            return jsonify({"error": "Message cannot be empty"}), 400

        # Call the AI analysis
        analysis_result = analyze_message(name, email, message)

        # Send to Telegram (regardless of analysis success)
        telegram_sent = send_telegram_message(name, email, message, analysis_result)

        # Prepare response
        response_data = {
            "status": "success",
            "message": "Your message has been received! I'll get back to you soon.",
            "telegram_sent": telegram_sent
        }

        # Add analysis to response if available
        if analysis_result:
            response_data["analysis"] = analysis_result.model_dump()

        return jsonify(response_data)

    except Exception as e:
        print(f"Contact endpoint error: {e}")
        return jsonify({
            "status": "error", 
            "message": "Something went wrong. Please try again or contact me directly."
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)