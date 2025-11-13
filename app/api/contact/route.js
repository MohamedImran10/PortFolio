import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    // Forward the request to Flask backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    
    const response = await fetch(`${backendUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
      timeout: 15000, // 15 second timeout
    });

    // Check if response is ok first
    if (!response.ok) {
      console.error(`Backend error: ${response.status} - ${response.statusText}`);
      return NextResponse.json(
        { 
          error: `Backend service unavailable (${response.status}). Please try again later.`,
          success: false 
        },
        { status: 502 }
      );
    }

    // Check content type before parsing JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Backend returned non-JSON response:', contentType);
      return NextResponse.json(
        { 
          error: "Backend service error. Please try again later.",
          success: false 
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error forwarding to backend:", error.message);
    
    // Handle specific error types
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: "Cannot connect to email service. Please try again later.",
          success: false 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: "Service temporarily unavailable. Please try again later.",
        success: false 
      },
      { status: 500 }
    );
  }
}
