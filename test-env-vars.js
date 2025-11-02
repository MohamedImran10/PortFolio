// Quick script to test if environment variables are loaded
// Run this with: node test-env-vars.js

require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Environment Variables Check:\n');
console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✅ Set (length: ' + process.env.TELEGRAM_BOT_TOKEN.length + ')' : '❌ Missing');
console.log('TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID ? '✅ Set (' + process.env.TELEGRAM_CHAT_ID + ')' : '❌ Missing');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set (length: ' + process.env.GEMINI_API_KEY.length + ')' : '❌ Missing');
console.log('\n');

// Test sending a message
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
  console.log('📤 Testing Telegram send...\n');
  
  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  fetch(telegramApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: "🧪 Test from Node.js script - Environment variables are working locally!",
    }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        console.log('✅ SUCCESS! Message sent to Telegram');
        console.log('Message ID:', data.result.message_id);
      } else {
        console.log('❌ FAILED! Telegram API returned error:');
        console.log(data);
      }
    })
    .catch(err => {
      console.log('❌ ERROR! Network or fetch error:');
      console.log(err.message);
    });
} else {
  console.log('❌ Cannot test Telegram - credentials missing!\n');
}
