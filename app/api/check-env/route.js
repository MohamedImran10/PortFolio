import { NextResponse } from "next/server";

// Simple endpoint to check if environment variables are loaded
// DELETE THIS FILE AFTER TESTING - it exposes sensitive info!
export async function GET() {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, GEMINI_API_KEY } = process.env;
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || 'development',
    env_variables: {
      TELEGRAM_BOT_TOKEN: TELEGRAM_BOT_TOKEN ? `✅ Set (${TELEGRAM_BOT_TOKEN.substring(0, 10)}...)` : '❌ Missing',
      TELEGRAM_CHAT_ID: TELEGRAM_CHAT_ID ? `✅ Set (${TELEGRAM_CHAT_ID})` : '❌ Missing',
      GEMINI_API_KEY: GEMINI_API_KEY ? `✅ Set (${GEMINI_API_KEY.substring(0, 10)}...)` : '❌ Missing',
    },
    note: "DELETE /app/api/check-env/route.js after testing!"
  });
}
