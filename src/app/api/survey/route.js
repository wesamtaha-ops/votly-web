import { NextResponse } from "next/server";
import { callVotlyApi, getCorsHeaders } from "../../helper";

export async function GET(req) {
  try {
    const userToken = req.headers.get("userToken");

    const res = await callVotlyApi({
      type: "get",
      url: "v2/survery?status=completed,active",
      data: {},
      userToken: userToken,
    });

    // Add CORS headers
    return NextResponse.json(res, {
      headers: getCorsHeaders(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: error.response?.status || 500,
        headers: getCorsHeaders(),
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(req) {
  return NextResponse.json(
    {},
    {
      headers: getCorsHeaders(),
    }
  );
}
