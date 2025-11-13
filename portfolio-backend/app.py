from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://mohamedimran.vercel.app"])  # Enable CORS for frontend

@app.route("/api/contact", methods=["POST"])
def contact():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data received"}), 400
            
        name = data.get("name")
        email = data.get("email")
        message = data.get("message")

        # Validate required fields
        if not name or not email or not message:
            return jsonify({"error": "Missing required fields"}), 400

        # Validate email format
        import re
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            return jsonify({"error": "Please enter a valid email address"}), 400

        # Get email credentials from environment
        sender_email = os.getenv("SENDER_EMAIL")
        sender_password = os.getenv("EMAIL_PASSWORD")
        your_email = os.getenv("YOUR_EMAIL")

        if not sender_email or not sender_password or not your_email:
            print("Missing email credentials in environment variables")
            return jsonify({"error": "Email service not configured"}), 500

        # Create email content
        email_content = f"""
New Portfolio Contact Form Submission

From: {name}
Email: {email}
Submitted: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Message:
{message}

---
This message was sent from your portfolio contact form.
You can reply directly to: {email}
        """.strip()

        # Create email message
        msg = MIMEMultipart()
        msg["Subject"] = f"New Portfolio Contact from {name}"
        msg["From"] = sender_email
        msg["To"] = your_email
        msg["Reply-To"] = email  # Allow easy reply to sender

        # Attach the message
        msg.attach(MIMEText(email_content, "plain"))

        # Send email
        try:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
                server.login(sender_email, sender_password)
                server.send_message(msg)
            
            print(f"✅ Email sent successfully from {name} ({email})")
            return jsonify({"message": "Message sent successfully!"}), 200
            
        except smtplib.SMTPException as smtp_error:
            print(f"❌ SMTP Error: {smtp_error}")
            return jsonify({"error": "Failed to send email. Please try again."}), 500
        except Exception as email_error:
            print(f"❌ Email Error: {email_error}")
            return jsonify({"error": "Email service error. Please try again."}), 500

    except Exception as e:
        print(f"❌ Server Error: {e}")
        return jsonify({"error": "Server error. Please try again later."}), 500

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "Flask Email API is running",
        "endpoints": ["/api/contact"],
        "method": "POST"
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)