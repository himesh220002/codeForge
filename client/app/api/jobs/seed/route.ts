import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");

    // Forward the seed request to the backend
    const response = await fetch(`${API_BASE_URL}/api/jobs/seed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to proxy seed jobs request" },
      { status: 500 }
    );
  }
}
