import { NextResponse } from "next/server";
import { callVotlyApi } from "../../helper";

export async function POST(req) {
  const userToken = req.headers.get("userToken");
  const lang = req.headers.get("lang");
  const data = await req.json();

  const res = await callVotlyApi({
    type: "post",
    url: "v2/forget",
    data: data,
    userToken: userToken,
    lang: lang,
  });

  return NextResponse.json(res);
}
