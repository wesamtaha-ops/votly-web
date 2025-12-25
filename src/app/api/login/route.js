import { NextResponse } from "next/server";
import { callVotlyApi } from "../../helper";

export async function POST(req) {
  try {
    const payload = await req.json();
    
    console.log('=== LOGIN API ROUTE CALLED ===');
    console.log('Request payload:', { 
      email: payload.email, 
      lang: payload.lang,
      hasPassword: !!payload.password 
    });
    console.log('Calling backend API: v2/login');
    
    const res = await callVotlyApi({
      type: "post",
      url: "v2/login",
      data: payload,
      lang: payload.lang,
    });

    console.log('Backend response status:', res?.status);
    console.log('Backend response data:', JSON.stringify(res, null, 2));
    console.log('=== LOGIN API ROUTE COMPLETE ===');

    return NextResponse.json(res);
  } catch (error) {
    console.error('=== LOGIN API ROUTE ERROR ===');
    console.error('Error:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('=== LOGIN API ROUTE ERROR END ===');
    
    return NextResponse.json(
      { 
        error: error.message,
        details: error.response?.data 
      },
      { status: error.response?.status || 500 }
    );
  }
}
