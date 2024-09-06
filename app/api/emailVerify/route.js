import { NextResponse } from "next/server";
import { callVotlyApi } from "../../../helper";

export async function POST(req) {
  const userToken = req.headers.get("userToken");
  const data = await req.json();

  const res = await callVotlyApi({
    type: "post",
    url: "v2/register/email",
    data: data,
    userToken: userToken,
  });

  return NextResponse.json(res);
}
