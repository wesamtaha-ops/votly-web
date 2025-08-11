import { NextResponse } from "next/server";
import { callVotlyApi } from "../../helper";

export async function POST(req) {
  try {
    const { owner, link } = await req.json();
    const userToken = req.headers.get("userToken");

    if (!owner || !link) {
      return NextResponse.json({
        status: 0,
        message: "Owner and link parameters are required",
      });
    }

    // Call the backend API to process the referral redemption
    const res = await callVotlyApi({
      type: "post",
      url: "v2/redeem",
      data: {
        owner: owner,
        link: link,
      },
      userToken: userToken,
    });

    return NextResponse.json(res);
  } catch (error) {
    console.error("Redeem API Error:", error);
    return NextResponse.json({
      status: 0,
      message: "Internal server error",
    });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const link = searchParams.get("link");
    const userToken = req.headers.get("userToken");

    if (!owner || !link) {
      return NextResponse.json({
        status: 0,
        message: "Owner and link parameters are required",
      });
    }

    // Call the backend API to process the referral redemption
    const res = await callVotlyApi({
      type: "get",
      url: `v2/redeem?owner=${owner}&link=${link}`,
      data: {},
      userToken: userToken,
    });

    return NextResponse.json(res);
  } catch (error) {
    console.error("Redeem API Error:", error);
    return NextResponse.json({
      status: 0,
      message: "Internal server error",
    });
  }
} 