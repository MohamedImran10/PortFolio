# Gmail Setup Instructions for Contact Form

## 🚀 Quick Setup Guide

Your contact form is now configured to send emails to `mohamedimranworkmailspace@gmail.com` using Nodemailer!

## 📧 Gmail Configuration Required

To enable email sending, you need to set up a Gmail App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** as the app
3. Select **Other** as the device and enter "Portfolio Contact Form"
4. Click **Generate**
5. Copy the 16-character password (format: `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables
1. Open `.env.local` file in your project root
2. Replace `your-16-character-app-password` with your actual app password:
   ```
   GMAIL_USER=mohamedimranworkmailspace@gmail.com
   GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
   ```

### Step 4: Test the Contact Form
1. Start your development server: `npm run dev`
2. Navigate to the contact section
3. Fill out and submit the form
4. Check your Gmail inbox for the message!

## ✅ What's Implemented

- ✅ Real email sending using Nodemailer
- ✅ Professional HTML email templates
- ✅ Error handling and user feedback
- ✅ Secure environment variable storage
- ✅ Form validation and spam protection

## 🔧 Troubleshooting

**Problem: "Authentication failed"**
- Solution: Make sure you're using an App Password, not your regular Gmail password

**Problem: "Less secure app access"**
- Solution: Use App Passwords instead - they're more secure than enabling "less secure apps"

**Problem: Emails not received**
- Solution: Check spam folder, verify the Gmail address is correct

## 🌐 Production Deployment

When deploying to platforms like Vercel, Netlify, or others:
1. Add environment variables in your hosting platform's dashboard
2. Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in production environment variables

---

**Need help?** Contact Mohamed Imran at mohamedimranworkmailspace@gmail.com
