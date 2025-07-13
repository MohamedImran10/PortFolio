import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request) {
  try {
    const { name, email, message } = await request.json()
    
    // Google Sheets configuration
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    // Prepare the data to append
    const timestamp = new Date().toISOString()
    const values = [[timestamp, name, email, message]]

    // Append data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:D', // Assuming columns A=Timestamp, B=Name, C=Email, D=Message
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    })
    
    console.log('Data successfully saved to Google Sheets')
    
    return NextResponse.json(
      { message: 'Message sent successfully! Data saved to Google Sheets.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving to Google Sheets:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
