import { NextResponse } from "next/server";
import axios from "axios";
import { analyzeMessage } from "../../../lib/ai-agent"; 

// Debug endpoint - remove after testing
export async function GET(request) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, GEMINI_API_KEY } = process.env;
  
  return NextResponse.json({
    telegram_bot_token: TELEGRAM_BOT_TOKEN ? `✅ Set (length: ${TELEGRAM_BOT_TOKEN.length})` : '❌ Missing',
    telegram_chat_id: TELEGRAM_CHAT_ID ? `✅ Set (${TELEGRAM_CHAT_ID})` : '❌ Missing',
    gemini_api_key: GEMINI_API_KEY ? `✅ Set (length: ${GEMINI_API_KEY.length})` : '❌ Missing',
    node_env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address.", success: false }, 
        { status: 400 }
      );
    }

    let analysis = { priority: "Medium", intent: "General Inquiry" };
    
    // 1. Try AI Agent (with timeout and error handling)
    try {
      const analysisPromise = analyzeMessage(message);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI timeout')), 5000)
      );
      analysis = await Promise.race([analysisPromise, timeoutPromise]);
    } catch (aiError) {
      console.log("AI analysis skipped:", aiError.message);
      // Continue with default values
    }

    // 2. Try sending to Telegram (optional, non-blocking)
    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
    
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      // Send Telegram notification in background (don't wait for it)
      const escapeMd = (text) => {
        return text.replace(/([_*\[\]()~`>#+=|{}.!-])/g, "\\$1");
      };

      const text = `
*New Portfolio Message* 🚀

*From:* ${escapeMd(name)}
*Email:* ${escapeMd(email)}

*AI Analysis:*
  \\- *Priority:* ${escapeMd(analysis.priority)}
  \\- *Intent:* ${escapeMd(analysis.intent)}

*Message:*
${escapeMd(message)}
      `;

      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      // Try sending to Telegram with better error handling using axios
      try {
        const response = await axios.post(telegramApiUrl, {
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: "MarkdownV2",
        }, {
          timeout: 10000, // 10 second timeout
        });

        console.log("✅ Telegram notification sent successfully", {
          messageId: response.data.result?.message_id,
          chatId: response.data.result?.chat?.id
        });

      } catch (telegramError) {
        console.error("❌ Telegram error details:", {
          message: telegramError.message,
          status: telegramError.response?.status,
          data: telegramError.response?.data,
          token_length: TELEGRAM_BOT_TOKEN?.length,
          chat_id: TELEGRAM_CHAT_ID,
        });
      }
    } else {
      console.warn("⚠️ Telegram credentials missing. TELEGRAM_BOT_TOKEN:", !!TELEGRAM_BOT_TOKEN, "TELEGRAM_CHAT_ID:", !!TELEGRAM_CHAT_ID);
    }

    // 3. Always respond successfully to user
    return NextResponse.json({ 
      message: "Thank you for your message! I'll get back to you soon.",
      success: true 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error in contact form:", error);
    return NextResponse.json(
      { 
        error: "Sorry, there was an error sending your message. Please try again or contact me directly.",
        success: false 
      },
      { status: 500 }
    );
  }
}
