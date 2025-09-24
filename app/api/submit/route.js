import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

// Config variables
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// Make sure to unescape the newline characters in the private key
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'All fields are required.' }, 
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' }, 
        { status: 400 }
      );
    }

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsByTitle[title]`

    // The header values **must** match the column headers in your sheet
    // Make sure your Google Sheet has columns: Name, Email, Message, Timestamp
    const newRow = await sheet.addRow({
      Name: body.name,
      Email: body.email,
      Message: body.message,
      Timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json({ 
      message: 'Thank you for your message! I\'ll get back to you soon.',
      success: true 
    }, { status: 200 });

  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return NextResponse.json({ 
      error: 'Sorry, there was an error sending your message. Please try again or contact me directly.',
      success: false 
    }, { status: 500 });
  }
}
