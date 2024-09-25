import { NextResponse } from "next/server";
import { callVotlyApi } from "../../helper";

export async function POST(req) {
  const userToken = req.headers.get("userToken");
  const lang = req.headers.get("lang");

  const res = await callVotlyApi({
    type: "post",
    url: "verificationCode/resend",
    userToken: userToken,
    lang: lang,
  });

  return NextResponse.json(res);
}
