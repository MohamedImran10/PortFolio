'use server';

/**
 * Server Action to send contact form messages to Telegram
 * Keeps sensitive tokens secure on the server
 */
export async function sendToTelegram(formData) {
  const { name, email, message, analysis } = formData;

  // Get environment variables from Vercel
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Debug logging
  console.log('🔍 [sendToTelegram] Checking environment variables...');
  console.log('✅ Token exists:', !!token);
  console.log('✅ Chat ID exists:', !!chatId);
  console.log('📋 Form data:', { name, email, messageLength: message?.length, analysis });

  // Validate required environment variables
  if (!token || !chatId) {
    console.error('❌ [sendToTelegram] Missing configuration:');
    console.error('   Token:', token ? 'SET' : 'MISSING');
    console.error('   Chat ID:', chatId ? 'SET' : 'MISSING');
    return {
      success: false,
      error: 'Server configuration error: Missing Telegram credentials'
    };
  }

  try {
    // Format the message with Markdown styling and AI Analysis (one-liner)
    const text = 
      `📬 *New Portfolio Message*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `🤖 *Analysis:* ${analysis}\n\n` +
      `📝 *Message:*\n\`\`\`\n${message}\n\`\`\``;

    console.log('📤 [sendToTelegram] Preparing to send message...');
    console.log('   Name:', name);
    console.log('   Email:', email);
    console.log('   Analysis:', analysis);
    console.log('   Message length:', message?.length);
    console.log('   Token (first 10):', token.substring(0, 10) + '...');
    console.log('   Chat ID:', chatId);

    // Send to Telegram Bot API
    const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload = {
      chat_id: chatId.toString(),
      text: text,
      parse_mode: 'Markdown',
    };

    console.log('📝 [sendToTelegram] Full payload text:');
    console.log(text);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    console.log('📥 [sendToTelegram] Response status:', response.status);
    console.log('📥 [sendToTelegram] Response headers:', response.headers);
    console.log('📥 [sendToTelegram] Response OK:', response.ok);
    console.log('📥 [sendToTelegram] Response data OK field:', data.ok);
    console.log('📥 [sendToTelegram] Full response data:', JSON.stringify(data));

    // Check if the request was successful
    if (data.ok === true) {
      console.log('✅ [sendToTelegram] Message sent successfully!');
      console.log('   Message ID:', data.result?.message_id);
      return {
        success: true,
        message: 'Message sent successfully to Telegram!'
      };
    } else {
      console.error('❌ [sendToTelegram] Telegram API returned error:');
      console.error('   Status code:', data.error_code);
      console.error('   Description:', data.description);
      console.error('   Full error:', JSON.stringify(data));
      return {
        success: false,
        error: data.description || 'Failed to send message to Telegram'
      };
    }
  } catch (error) {
    console.error('❌ [sendToTelegram] Exception caught:');
    console.error('   Error message:', error.message);
    console.error('   Error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}
