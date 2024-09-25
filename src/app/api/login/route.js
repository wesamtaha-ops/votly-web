import { NextResponse } from "next/server";
import { callVotlyApi } from "../../helper";

export async function POST(req) {
  const payload = await req.json();

  const res = await callVotlyApi({
    type: "post",
    url: "v2/login",
    data: payload,
    lang: payload.lang,
  });

  return NextResponse.json(res);
}
