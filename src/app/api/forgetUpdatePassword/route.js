import { NextResponse } from "next/server";
import { callVotlyApi } from "../../helper";

export async function POST(req) {
  const userToken = req.headers.get("userToken");
  const data = await req.json();

  const res = await callVotlyApi({
    type: "post",
    url: "v2/forget_update",
    data: data,
    userToken: userToken,
  });

  return NextResponse.json(res);
}
