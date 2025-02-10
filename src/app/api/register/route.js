import { NextResponse } from "next/server";
import { callVotlyApi } from "../../helper";

export async function POST(req) {
  const payload = await req.json();
  const lang = req.headers.get("lang");

  const res = await callVotlyApi({
    type: "post",
    url: "v2/register",
    data: payload,
    lang: lang,
  });

  return NextResponse.json(res);
}
