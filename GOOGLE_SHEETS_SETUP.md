# Google Sheets Setup Instructions for Contact Form

## 🚀 Quick Setup Guide

Your contact form is now configured to store data in Google Sheets instead of sending emails!

## 📊 Google Sheets Configuration Required

To enable data storage in Google Sheets, you need to set up Google Cloud Console and Google Sheets API:

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

### Step 2: Enable Google Sheets API
1. In Google Cloud Console, navigate to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

### Step 3: Create Service Account
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in the service account details:
   - Name: `portfolio-contact-form`
   - Description: `Service account for portfolio contact form`
4. Click **Create and Continue**
5. Skip role assignment (click **Continue**)
6. Click **Done**

### Step 4: Generate Service Account Key
1. In the **Credentials** page, find your service account
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** → **Create New Key**
5. Select **JSON** format and click **Create**
6. A JSON file will be downloaded - keep it safe!

### Step 5: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Portfolio Contact Form Responses"
4. In the first row, add headers:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Message`
5. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 6: Share Sheet with Service Account
1. In your Google Sheet, click **Share** button
2. Add the service account email (from the JSON file, field: `client_email`)
3. Give it **Editor** permission
4. Click **Send**

### Step 7: Update Environment Variables
1. Open the downloaded JSON file from Step 4
2. Open `.env.local` file in your project root
3. Update the environment variables:
   ```
   GOOGLE_SHEET_ID=your-sheet-id-from-url
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@project-id.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-from-json\n-----END PRIVATE KEY-----"
   ```

**Important Notes:**
- The `GOOGLE_PRIVATE_KEY` should include the full private key from the JSON file, including the BEGIN and END lines
- Make sure to replace `\n` characters in the private key with actual line breaks
- Keep the quotes around the private key

### Step 8: Test the Contact Form
1. Start your development server: `npm run dev`
2. Navigate to the contact section
3. Fill out and submit the form
4. Check your Google Sheet for the new data!

## ✅ What's Implemented

- ✅ Real data storage using Google Sheets API
- ✅ Automatic timestamp for each submission
- ✅ Organized data structure (Timestamp, Name, Email, Message)
- ✅ Error handling and user feedback
- ✅ Secure environment variable storage
- ✅ Form validation and spam protection

## 🔧 Troubleshooting

**Problem: "Authentication failed"**
- Solution: Make sure the service account JSON credentials are correctly copied to environment variables

**Problem: "Permission denied"**
- Solution: Ensure you've shared the Google Sheet with your service account email with Editor permissions

**Problem: "Sheet not found"**
- Solution: Verify the GOOGLE_SHEET_ID is correct (from the Google Sheet URL)

**Problem: "Private key error"**
- Solution: Ensure the GOOGLE_PRIVATE_KEY includes the full key with proper line breaks

## 🌐 Production Deployment

When deploying to platforms like Vercel, Netlify, or others:
1. Add environment variables in your hosting platform's dashboard
2. Set `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY` in production environment variables
3. For the private key, you may need to replace actual line breaks with `\n` in production

## 📊 Data Structure

Your Google Sheet will store data in this format:
| Timestamp | Name | Email | Message |
|-----------|------|-------|---------|
| 2024-01-01T12:00:00.000Z | John Doe | john@example.com | Hello, I'd like to... |

---

**Need help?** Contact Mohamed Imran at mohamedimranworkmailspace@gmail.com
