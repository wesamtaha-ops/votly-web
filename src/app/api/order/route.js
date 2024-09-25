import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import { callVotlyApi } from "../../helper";

// function generateYouGiftHeader() {
//   // Example values
//   const API_KEY = "ENGCODH85O7OKXRTYZYC";
//   const API_SECRET = "mPNoCqWfHRaRAD1lgqPR9nnYpZ9aeZEg5qTMTrUK";

//   // Create headers and options
//   const options = {
//     key: API_SECRET,
//     keyId: API_KEY,
//     algorithm: "hmac-sha256",
//     headers: ["date"],
//   };

//   // Generate the date header (UTC Current Date and Time)
//   const headers = {
//     date: new Date().toUTCString(),
//   };

//   // Sign the header elements
//   const sign = options.headers
//     .map((header) => `${header}: ${headers[header]}`)
//     .join("\n");

//   // Create the HMAC signature
//   const signature = crypto
//     .createHmac("sha256", options.key)
//     .update(sign)
//     .digest("base64");

//   // Add the Authorization header
//   headers["authorization"] = `Signature keyId="${options.keyId}",algorithm="${
//     options.algorithm
//   }",headers="${options.headers.join(" ")}",signature="${signature}"`;
//   headers["accept"] = "application/json";
//   headers["X-Api-Key"] = API_KEY;

//   return headers;
// }

export async function GET(req) {
  const userToken = req.headers.get("userToken");

  const res = await callVotlyApi({
    type: "get",
    url: "v2/vouchers",
    userToken: userToken,
  });

  return NextResponse.json(res);
}

export async function POST(req) {
  const userToken = req.headers.get("userToken");
  const lang = req.headers.get("lang");

  const data = await req.json();

  const res = await callVotlyApi({
    type: "post",
    url: "v2/redeem",
    data: data,
    userToken: userToken,
    lang: lang,
  });

  return NextResponse.json({
    data: res,
  });
}
