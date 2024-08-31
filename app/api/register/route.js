import { NextResponse } from "next/server";
import { callVotlyApi } from "../../../helper";

export async function POST(req) {
  const payload = await req.json();

  const res = await callVotlyApi({
    type: "post",
    url: "register",
    data: payload,
  });

  return NextResponse.json(res);
}
