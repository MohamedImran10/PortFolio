# Portfolio Contact Form Setup Guide

## Architecture Overview

Your portfolio now uses:
- **Frontend**: Next.js 15 (React) on Vercel
- **Backend**: Flask API for contact processing
- **Analysis**: Google Gemini API (full structured analysis)
- **Notifications**: Telegram Bot API

## Backend Setup (Local Development)

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create `backend/.env` with:

```bash
# Telegram Bot Credentials
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Google Gemini API Key (FREE - get from https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Flask Configuration
FLASK_ENV=production
PORT=5000
```

**Where to get credentials:**

1. **Telegram Bot Token**: Ask BotFather on Telegram for a token
2. **Telegram Chat ID**: Use @userinfobot to get your chat ID
3. **Gemini API Key**: 
   - Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the key to `.env`
   - ✅ **FREE** - No credit card required

### 3. Run Flask Backend Locally

```bash
cd backend
python app.py
```

Backend will start at: `http://localhost:5000`

## Frontend Setup

### 1. Development Mode

The frontend already calls the Flask backend:

```bash
cd frontend
npm run dev
```

The form will use: `http://localhost:5000/contact`

### 2. Production Deployment

**On Vercel Dashboard:**

1. Go to your portfolio project settings
2. Add Environment Variables:
   ```
   NEXT_PUBLIC_FLASK_API_URL=your_flask_api_url
   ```

**For Flask Backend Hosting Options:**
- **Render.com** (FREE tier available)
- **Railway** (Paid, ~$5/month)
- **PythonAnywhere** (Paid with free tier)
- **AWS EC2** (Free tier available)
- **DigitalOcean** (Paid, $4/month)

## How It Works

### Contact Form Flow

1. **User fills form** → name, email, message
2. **Frontend sends POST** to `Flask /contact` endpoint
3. **Flask backend:**
   - ✅ Analyzes message with **Gemini API**
   - ✅ Formats detailed analysis (category, sentiment, urgency, summary, actionability, next steps)
   - ✅ Sends **formatted message + analysis to Telegram**
   - ✅ Returns success/error response
4. **Frontend shows** "Message sent successfully!" or error
5. **You receive in Telegram:**
   ```
   🚀 New Portfolio Contact!
   👤 Name: John Doe
   📧 Email: john@example.com
   
   💬 Message:
   I'm interested in your portfolio...
   
   🤖 AI Analysis:
   • Category: inquiry
   • Sentiment: Polite Interest
   • Urgency: medium
   • Summary: Prospective client interested in portfolio
   • Actionable: Yes
   • Next Step: Send portfolio link and availability
   ```

## Features

✅ **Gemini Analysis** - Full structured analysis with:
- Message category (inquiry, support, partnership, recruitment, etc.)
- Sentiment analysis with description
- Urgency level (high, medium, low)
- 1-sentence summary
- Actionability assessment
- Suggested next steps

✅ **Telegram Notifications** - Receive detailed formatted messages

✅ **Error Handling** - Graceful fallbacks if analysis fails

✅ **CORS Enabled** - Secure cross-origin requests

## Testing

### Local Test

1. Start Flask: `python backend/app.py`
2. Start Frontend: `npm run dev`
3. Fill and submit contact form
4. Check Telegram for notification
5. Check console logs for debug info

### Test Telegram Directly

```bash
curl -X POST http://localhost:5000/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

Expected response:
```json
{
  "status": "success",
  "message": "Your message has been received! I'll get back to you soon.",
  "telegram_sent": true,
  "analysis": {
    "category": "inquiry",
    "sentiment": "Neutral",
    "urgency": "low",
    "summary": "Test message for contact form",
    "is_actionable": false,
    "suggested_next_step": "Acknowledge receipt"
  }
}
```

## Troubleshooting

### Form shows success but no Telegram message

1. Check `.env` has correct `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
2. Check Flask logs for errors
3. Test with curl command above
4. Verify bot has permission to send messages in chat

### Gemini API errors

1. Verify `GEMINI_API_KEY` is correct
2. Check API quota at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
3. Ensure key has Gemini API access enabled

### CORS errors in frontend

1. Check `NEXT_PUBLIC_FLASK_API_URL` is correct
2. Verify Flask has CORS enabled (already in `app.py`)
3. Check if Flask backend is running

## File Structure

```
/backend
  ├── app.py              # Flask app with /contact endpoint
  ├── requirements.txt    # Python dependencies
  ├── .env               # Local environment variables (NEVER commit)
  └── .env.example       # Template for .env

/frontend
  ├── components/
  │   └── ContactForm.js  # Contact form component
  ├── .env.local          # Next.js env vars (NEVER commit)
  └── app/
      └── layout.js       # Layout
```

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` files to GitHub
- Keep `TELEGRAM_BOT_TOKEN` and `GEMINI_API_KEY` secret
- Use environment variables in production (Vercel, Render, etc.)
- CORS is configured to allow your frontend domain only

## Next Steps

1. ✅ Set up backend `.env` with credentials
2. ✅ Update frontend `NEXT_PUBLIC_FLASK_API_URL` for production
3. ✅ Deploy Flask backend to hosting service
4. ✅ Test contact form end-to-end
5. ✅ Monitor Telegram for submissions

---

**Questions?** Check console logs (`F12` in browser) or Flask logs for detailed error messages.
