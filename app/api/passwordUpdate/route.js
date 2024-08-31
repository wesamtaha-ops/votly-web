import { NextResponse } from "next/server";
import { callVotlyApi } from "../../../helper";

export async function POST(req) {
  const userToken = req.headers.get("userToken");

  const payload = await req.json();

  const res = await callVotlyApi({
    type: "post",
    url: "user/passsword",
    data: payload,
    userToken: userToken,
  });

  return NextResponse.json(res);
}
