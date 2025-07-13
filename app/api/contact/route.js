import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    const { name, email, message } = await request.json()
    
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com', // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password' // Your Gmail App Password
      }
    })
    
    // Email content
    const mailOptions = {
      from: email, // Sender's email
      to: 'mohamedimranworkmailspace@gmail.com', // Your email
      subject: `Portfolio Contact: Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #059669;">
            <p style="margin: 0; color: #065f46; font-size: 14px;">
              This message was sent from your portfolio contact form.
            </p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
        
        ---
        This message was sent from your portfolio contact form.
      `
    }
    
    // Send email
    await transporter.sendMail(mailOptions)
    
    console.log('Email sent successfully to mohamedimranworkmailspace@gmail.com')
    
    return NextResponse.json(
      { message: 'Email sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
