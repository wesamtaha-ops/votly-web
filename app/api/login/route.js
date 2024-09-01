import { NextResponse } from "next/server";
import { callVotlyApi } from "../../../helper";

export async function POST(req) {
  const payload = await req.json();

  const res = await callVotlyApi({
    type: "post",
    url: "login",
    data: payload,
  });

  return NextResponse.json(res);
}
