import { NextResponse } from "next/server";
import { callVotlyApi } from "../../helper";

export async function POST(req) {
  const userToken = req.headers.get("userToken");

  const res = await callVotlyApi({
    type: "post",
    url: "verificationCode/resend",
    userToken: userToken,
  });

  return NextResponse.json(res);
}
