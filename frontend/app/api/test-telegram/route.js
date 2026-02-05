'use server';

export async function GET(request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log('🧪 [test-telegram] Testing Telegram bot...');
  console.log('   Token exists:', !!token);
  console.log('   Chat ID exists:', !!chatId);

  if (!token || !chatId) {
    return Response.json({
      success: false,
      error: 'Missing Telegram credentials',
      token_exists: !!token,
      chat_id_exists: !!chatId
    });
  }

  try {
    const testMessage = {
      chat_id: chatId.toString(),
      text: `✅ Test message from Vercel\n\nToken first 10: ${token.substring(0, 10)}...\nChat ID: ${chatId}\n\nTime: ${new Date().toISOString()}`,
      parse_mode: 'Markdown'
    };

    console.log('📤 Sending test message to Telegram...');
    console.log('   URL: https://api.telegram.org/bot' + token.substring(0, 10) + '.../sendMessage');

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMessage)
    });

    const data = await response.json();
    
    console.log('📥 Response:', data);

    return Response.json({
      success: data.ok === true,
      telegram_response: data,
      token_substring: token.substring(0, 10) + '...',
      chat_id: chatId
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    return Response.json({
      success: false,
      error: error.message
    });
  }
}
