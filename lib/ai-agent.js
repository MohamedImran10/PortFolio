import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// I've used the portfolio-focused categories here.
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `
    You are an expert analysis agent for a developer's portfolio contact form.
    Your job is to analyze the incoming message and return a JSON object.
    The message will be from a potential employer, client, or recruiter.
    
    Classify the message based on these two keys:
    1.  "priority": "High", "Medium", or "Low".
    2.  "intent": "Job Offer", "Project Inquiry", "Spam", "Networking", "Feedback", or "Other".
    
    Always respond with only a valid JSON object.
    
    Example:
    {
      "priority": "High",
      "intent": "Job Offer"
    }
  `,
  generationConfig: {
    responseMimeType: "application/json",
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    // add other categories if needed
  ],
});

export async function analyzeMessage(message) {
  try {
    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    const response = result.response;
    // Cleans up the AI's response to ensure it's valid JSON
    const jsonText = response.text().replace(/```json|```/g, "").trim();
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("AI analysis failed:", error);
    // Fallback in case AI fails
    return {
      priority: "Medium",
      intent: "Not Analyzed",
    };
  }
}
