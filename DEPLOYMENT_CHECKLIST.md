# 🚀 Deployment Checklist - Telegram Bot Integration

## ❌ Problem
Form shows "submitting successfully" but messages don't reach Telegram bot in production.

## ✅ Solution
Follow these steps to fix the issue:

---

## 1️⃣ Add Environment Variables to Vercel

Your Telegram credentials are in `.env.local` but **NOT** in Vercel's production environment.

### Steps:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **PortFolio**
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `TELEGRAM_BOT_TOKEN` | `8336342366:AAGC0-Y2uqjV0UDTSQ_8dLUnBLisIPWCNWM` | Production, Preview, Development |
| `TELEGRAM_CHAT_ID` | `6509280706` | Production, Preview, Development |
| `GEMINI_API_KEY` | `AIzaSyB_b49oytfZ6Hx8X3KdNQjOXXzcX0-a3rE` | Production, Preview, Development |

> **Security Note**: Never commit `.env.local` to GitHub. These values are already in your repo, so rotate them if this repo is public!

5. Click **Save**
6. **Redeploy** your site (Vercel should auto-redeploy, or click "Redeploy" on latest deployment)

---

## 2️⃣ Check Deployment Logs

After redeploying with environment variables:

1. Go to **Deployments** tab in Vercel
2. Click your latest deployment
3. Go to **Functions** → Find `/api/contact`
4. Click **View Logs**
5. Submit a test form on your live site
6. Check logs for:
   - ✅ `Telegram notification sent successfully` (good!)
   - ❌ `Telegram credentials missing` (env vars not set)
   - ❌ `Telegram API error: 400` (malformed request)
   - ❌ `Telegram notification failed` (network/timeout error)

---

## 3️⃣ Verify Your Telegram Bot

### Test Bot Locally:

```bash
# Test if bot token is valid
curl https://api.telegram.org/bot8336342366:AAGC0-Y2uqjV0UDTSQ_8dLUnBLisIPWCNWM/getMe

# Test if chat ID is correct
curl -X POST https://api.telegram.org/bot8336342366:AAGC0-Y2uqjV0UDTSQ_8dLUnBLisIPWCNWM/sendMessage \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "6509280706", "text": "Test from terminal"}'
```

**Expected response:**
```json
{"ok":true,"result":{...}}
```

**If you get `{"ok":false,...}`:**
- Bot might be blocked by user
- Chat ID might be incorrect
- Bot token might be invalid/expired

---

## 4️⃣ Common Issues & Fixes

### Issue 1: "Chat not found"
**Cause:** Wrong `TELEGRAM_CHAT_ID` or you haven't started the bot
**Fix:** 
1. Open Telegram
2. Search for your bot
3. Click **Start** or send `/start`
4. Get your chat ID:
   ```bash
   curl https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
   ```

### Issue 2: "Can't parse entities"
**Cause:** MarkdownV2 escaping issues
**Fix:** Already handled in updated code! Check the `escapeMd()` function.

### Issue 3: Timeout in serverless
**Cause:** Vercel free tier has 10s timeout, fetch might be slow
**Fix:** Already non-blocking! But you can add timeout:
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);
fetch(url, { signal: controller.signal })...
```

### Issue 4: CORS or network errors
**Cause:** Telegram API blocked in some regions
**Fix:** Use webhook or proxy (advanced)

---

## 5️⃣ Test Checklist

- [ ] Environment variables added to Vercel
- [ ] Site redeployed
- [ ] Test form submission on live site
- [ ] Check Vercel function logs
- [ ] Telegram message received
- [ ] Console logs show `✅ Telegram notification sent successfully`

---

## 6️⃣ Local Testing

To test locally before deploying:

```bash
# 1. Make sure .env.local has your credentials
cat .env.local

# 2. Run dev server
npm run dev

# 3. Submit form at http://localhost:3000
# 4. Check terminal output for logs
```

---

## 🔒 Security Improvements

**Current issue:** Your credentials are exposed in `.env.local` in the repo!

### Fix:

1. **Add `.env.local` to `.gitignore`:**
   ```bash
   echo ".env.local" >> .gitignore
   git rm --cached .env.local
   git commit -m "Remove .env.local from tracking"
   ```

2. **Rotate your secrets:**
   - Get new Telegram bot token from [@BotFather](https://t.me/BotFather)
   - Get new Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Create `.env.example`:**
   ```bash
   GEMINI_API_KEY=your_key_here
   TELEGRAM_BOT_TOKEN=your_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   ```

---

## 📊 Monitoring

To monitor Telegram delivery in production, consider:

1. **Add webhook logging** (save to DB/log service)
2. **Use Vercel Analytics** to track API errors
3. **Add Sentry** for error tracking:
   ```bash
   npm install @sentry/nextjs
   ```

---

## 🎉 Final Check

After following steps 1-5, verify:

1. Submit form on **live site**
2. See success message in browser
3. Receive message in Telegram
4. Check Vercel logs show ✅

**Still not working?** Check Vercel function logs for error details.

---

## 📞 Need Help?

- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [Vercel Environment Variables Guide](https://vercel.com/docs/environment-variables)
- [Next.js API Routes Docs](https://nextjs.org/docs/api-routes/introduction)

Good luck! 🚀
