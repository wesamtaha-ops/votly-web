import axios from "axios";

// export async function setUserToken(token) {
//   await localStorage.setItem("context", JSON.stringify({ token }));
// }

// export async function getUserToken(session) {
//   if (session?.id) {
//     return session.id;
//   }
//   const localStorageContext = JSON.parse(localStorage.getItem("context"));

//   if (localStorageContext) {
//     return localStorageContext.token;
//   }

//   const res = await callApi({ url: "/api/context", method: "get" });
//   const context = res.data;
//   await setUserToken(context.token);
//   return context.token;
// }

export async function callApi({ type, url, data = [], userToken }) {
  const response = await axios(
    `${process.env.NEXT_PUBLIC_BASE_URL_API}${url}`,
    {
      method: type,
      data: {
        ...data,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        userToken: userToken,
      },
    }
  );
  return response.data;
}

export async function callVotlyApi({ type, url, data = [], userToken }) {
  const response = await axios(`${process.env.BACKEND_BASE_URL_API}${url}`, {
    method: type,
    data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Authorization: `Bearer ${userToken}`,
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
}

export function apiSuccessResponse(data, message = "") {
  return {
    statusCode: 200,
    message,
    data,
  };
}

export function apiErrorResponse(errorCode, message = "") {
  return {
    errorCode: errorCode ?? 400,
    message,
  };
}
