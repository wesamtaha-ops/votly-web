import { NextResponse } from "next/server";
import { callVotlyApi } from "../../helper";

export async function GET(req) {
  const userToken = req.headers.get("userToken");

  const res = await callVotlyApi({
    type: "get",
    url: "user",
    data: {},
    userToken: userToken,
  });

  return NextResponse.json(res);
}
