import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address.", success: false }, 
        { status: 400 }
      );
    }

    // Get email credentials from environment variables
    const { SENDER_EMAIL, EMAIL_PASSWORD, RECEIVER_EMAIL } = process.env;

    if (!SENDER_EMAIL || !EMAIL_PASSWORD || !RECEIVER_EMAIL) {
      console.error("Missing email credentials in environment variables");
      return NextResponse.json(
        { error: "Email service is not configured. Please try again later.", success: false },
        { status: 500 }
      );
    }

    // Create transporter for Gmail
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: SENDER_EMAIL,
        pass: EMAIL_PASSWORD // This should be an app-specific password
      }
    });

    // Email content
    const emailContent = `
New Portfolio Contact Form Submission

From: ${name}
Email: ${email}
Submitted: ${new Date().toLocaleString()}

Message:
${message}

---
This message was sent from your portfolio contact form.
    `.trim();

    // Email options
    const mailOptions = {
      from: SENDER_EMAIL,
      to: RECEIVER_EMAIL,
      subject: `New Portfolio Contact from ${name}`,
      text: emailContent,
      replyTo: email // Allow easy reply to the sender
    };

    // Send email with timeout
    const sendEmail = () => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Email sending timeout'));
        }, 15000); // 15 second timeout

        transporter.sendMail(mailOptions, (error, info) => {
          clearTimeout(timeout);
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });
    };

    try {
      const info = await sendEmail();
      console.log("✅ Email sent successfully:", info.messageId);
      
      return NextResponse.json({ 
        message: "Thank you for your message! I'll get back to you soon.",
        success: true 
      }, { status: 200 });

    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      return NextResponse.json(
        { error: "Failed to send email. Please try again later.", success: false },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error in contact form:", error);
    return NextResponse.json(
      { 
        error: "Sorry, there was an error processing your message. Please try again or contact me directly.",
        success: false 
      },
      { status: 500 }
    );
  }
}
