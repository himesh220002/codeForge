import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract Authorization header to forward BYOK API key
    const authHeader = req.headers.get("Authorization");
    const headers: Record<string, string> = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Forward the FormData to the Express backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/api/ats/check`, {
      method: "POST",
      headers, // Pass through headers (importantly auth) but NOT Content-Type (fetch auto-sets it with boundary for FormData)
      body: formData,
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error: any) {
    console.error("ATS Proxy Route Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error in Next.js proxy", error: error.message },
      { status: 500 }
    );
  }
}
