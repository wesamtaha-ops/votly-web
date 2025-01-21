import { NextResponse } from "next/server";
import { callVotlyApi } from "../../helper";

export async function GET(req) {
  const userToken = req.headers.get("userToken");

  const res = await callVotlyApi({
    type: "get",
    url: "v2/user/profile/answers",
    data: {},
    userToken: userToken,
  });

  return NextResponse.json(res);
}

export async function POST(req) {
  const userToken = req.headers.get("userToken");
  const payload = await req.json();

  const res = await callVotlyApi({
    type: "post",
    url: "v2/user/profile/answers",
    data: payload,
    userToken: userToken,
  });

  return NextResponse.json(res);
}
