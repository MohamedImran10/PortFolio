#!/bin/bash

# Script to add environment variables to Vercel
# Run this with: bash add-vercel-env.sh

echo "🔧 Adding environment variables to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it with:"
    echo "   npm i -g vercel"
    echo ""
    echo "Or add variables manually via Vercel Dashboard:"
    echo "   https://vercel.com/dashboard → Your Project → Settings → Environment Variables"
    exit 1
fi

# Add environment variables
echo "📤 Adding TELEGRAM_BOT_TOKEN..."
echo "8336342366:AAGC0-Y2uqjV0UDTSQ_8dLUnBLisIPWCNWM" | vercel env add TELEGRAM_BOT_TOKEN production

echo "📤 Adding TELEGRAM_CHAT_ID..."
echo "6509280706" | vercel env add TELEGRAM_CHAT_ID production

echo "📤 Adding GEMINI_API_KEY..."
echo "AIzaSyB_b49oytfZ6Hx8X3KdNQjOXXzcX0-a3rE" | vercel env add GEMINI_API_KEY production

echo ""
echo "✅ Done! Now redeploy your site:"
echo "   vercel --prod"
echo ""
echo "Or trigger redeploy from Vercel Dashboard → Deployments → Redeploy"
