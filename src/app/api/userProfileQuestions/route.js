import { NextResponse } from "next/server";
import { callVotlyApi } from "../../helper";

export async function GET(req) {
  const userToken = req.headers.get("userToken");
  const lang = req.headers.get("lang");

  const res = await callVotlyApi({
    type: "get",
    url: "v2/user/profile/questions",
    data: {},
    userToken: userToken,
    lang: lang,
  });

  return NextResponse.json(res);
}
