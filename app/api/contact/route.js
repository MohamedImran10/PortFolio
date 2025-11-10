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
        // Properly escape all MarkdownV2 special characters
        return text.replace(/([_*\[\]()~`>#+=|{}.!-])/g, "\\$1");
      };

      // Use plain text instead of MarkdownV2 to avoid parsing issues
      const text = `New Portfolio Message 🚀

From: ${name}
Email: ${email}

AI Analysis:
- Priority: ${analysis.priority}
- Intent: ${analysis.intent}

Message:
${message}`;

      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      // Try sending to Telegram with retry logic
      const sendTelegramWithRetry = async (maxRetries = 3) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`📤 Telegram attempt ${attempt}/${maxRetries}`);
            
            const response = await axios.post(telegramApiUrl, {
              chat_id: TELEGRAM_CHAT_ID,
              text: text,
              // Remove parse_mode for plain text to avoid parsing errors
            }, {
              timeout: 10000, // 10 second timeout
              headers: {
                'Content-Type': 'application/json'
              }
            });

            console.log("✅ Telegram notification sent successfully", {
              messageId: response.data?.result?.message_id,
              chatId: response.data?.result?.chat?.id,
              attempt: attempt
            });
            return true;

          } catch (telegramError) {
            // Extract detailed error info
            const errorInfo = {
              message: telegramError.message,
              code: telegramError.code,
              status: telegramError.response?.status,
              statusText: telegramError.response?.statusText,
              data: telegramError.response?.data,
              errno: telegramError.errno,
              syscall: telegramError.syscall,
              attempt: attempt,
              retrying: attempt < maxRetries
            };

            console.error(`❌ Telegram attempt ${attempt} failed:`, errorInfo);

            // Wait before retrying (exponential backoff)
            if (attempt < maxRetries) {
              const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
              console.log(`⏳ Waiting ${delay}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }
        return false;
      };

      // Send Telegram in background (non-blocking)
      sendTelegramWithRetry().catch(err => {
        console.error("❌ Telegram failed after all retries:", {
          message: err.message,
          code: err.code
        });
      });
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
