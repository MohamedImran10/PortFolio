# Deploy Flask Backend to Render.com (FREE)

## Step 1: Prepare Your Repo

Your backend is already ready! Just make sure `.gitignore` includes `.env`:

```bash
cd backend
echo ".env" >> .gitignore
git add .
git commit -m "Prepare Flask backend for deployment"
git push
```

## Step 2: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click **Sign Up** (use GitHub for faster setup)
3. Authorize Render to access your GitHub

## Step 3: Create New Web Service

1. Click **New +** → **Web Service**
2. Select your **PortFolio** repository
3. Configure:
   - **Name**: `portfolio-backend` (or any name)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: `Free` (includes 750 hours/month)

## Step 4: Add Environment Variables

On Render dashboard, go to **Environment**:

```
TELEGRAM_BOT_TOKEN = 8453027399:AAF8wJOwjF_O1OnLR0X4enZOMnXVpW29nlk
TELEGRAM_CHAT_ID = 6509280706
GEMINI_API_KEY = your_gemini_api_key_here
FLASK_ENV = production
```

**Get Gemini API Key:**
- Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- Sign in with Google
- Click **Create API Key**
- Copy and paste here

## Step 5: Deploy

1. Click **Create Web Service**
2. Render will automatically deploy from your GitHub repo
3. Wait for build to complete (2-3 minutes)
4. You'll get a URL like: `https://portfolio-backend-xxxx.onrender.com`
5. **Copy this URL** - you need it next

## Step 6: Update Vercel

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **Portfolio** project
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   ```
   NEXT_PUBLIC_FLASK_API_URL = https://portfolio-backend-xxxx.onrender.com
   ```
   (Replace with your actual Render URL)

5. Click **Save**
6. Go to **Deployments** → **Redeploy** the latest deployment

## Step 7: Test

1. Go to your portfolio: [https://mohamedimran.vercel.app](https://mohamedimran.vercel.app)
2. Fill out the contact form
3. Submit
4. Should see: ✅ "Message sent successfully!"
5. Check Telegram for the notification with AI analysis

## Verification Checklist

- ✅ Flask backend deployed on Render
- ✅ Environment variables set in Render dashboard
- ✅ `NEXT_PUBLIC_FLASK_API_URL` updated in Vercel
- ✅ Vercel redeployed
- ✅ Contact form working
- ✅ Telegram receiving messages with Gemini analysis

## Troubleshooting

**Form still shows error?**
1. Check Vercel deployment log
2. Open browser DevTools (F12) → Console
3. Look for the actual error message
4. Check Render logs at [https://dashboard.render.com](https://dashboard.render.com) → Your Service → Logs

**Render build failed?**
1. Check build logs in Render dashboard
2. Ensure `requirements.txt` has all dependencies
3. Ensure `app.py` exists in backend folder

**Telegram not receiving?**
1. Check Flask logs in Render dashboard
2. Verify credentials in `.env`
3. Test with curl:
   ```bash
   curl -X POST https://portfolio-backend-xxxx.onrender.com/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","message":"test"}'
   ```

## Notes

- **Render free tier**: Spins down after 15 min of inactivity (takes ~30 sec to wake up)
- **No credit card required** for free tier
- **Monthly quota**: 750 hours (free tier)
- **Automatic redeploy**: When you push to GitHub
