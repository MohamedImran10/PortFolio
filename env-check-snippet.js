// Add this to your /api/contact route to debug env vars in production
// This will help us see if env vars are actually loaded

export async function GET(request) {
  return Response.json({
    telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN ? '✅ Set (length: ' + process.env.TELEGRAM_BOT_TOKEN.length + ')' : '❌ Missing',
    telegram_chat_id: process.env.TELEGRAM_CHAT_ID ? '✅ Set (' + process.env.TELEGRAM_CHAT_ID + ')' : '❌ Missing',
    gemini_api_key: process.env.GEMINI_API_KEY ? '✅ Set (length: ' + process.env.GEMINI_API_KEY.length + ')' : '❌ Missing',
    node_env: process.env.NODE_ENV,
  });
}
