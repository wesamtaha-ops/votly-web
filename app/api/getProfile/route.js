import { NextResponse } from "next/server";
import { callVotlyApi } from "../../../helper";

export async function GET(req) {
  const userToken = req.headers.get("userToken");

  console.log("userToken", userToken);

  const res = await callVotlyApi({
    type: "get",
    url: "v2/complete_profile",
    data: {},
    userToken: userToken,
  });

  return NextResponse.json(res);
}

export async function POST(req) {
  const userToken = req.headers.get("userToken");
  const data = await req.json();

  const res = await callVotlyApi({
    type: "post",
    url: "v2/complete_profile",
    data: data,
    userToken: userToken,
  });

  return NextResponse.json(res);
}
