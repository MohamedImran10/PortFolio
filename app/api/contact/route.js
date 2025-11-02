import { NextResponse } from "next/server";
import { analyzeMessage } from "../../../lib/ai-agent"; 

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

      // Fire and forget - don't block the response
      fetch(telegramApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: "MarkdownV2",
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ Telegram API error:", res.status, errorText);
          } else {
            console.log("✅ Telegram notification sent successfully");
          }
        })
        .catch(err => {
          console.error("❌ Telegram notification failed:", err.message);
          console.error("Stack:", err.stack);
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
