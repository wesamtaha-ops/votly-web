import axios from 'axios';

export async function getUserToken(session) {
  if (session?.id) {
    return session.id;
  }
}

export async function redirectIfEmailPhoneNotVerified(session) {
  if (!session || session.user.is_email_verified !== 1) {
    return { redirect: '/email-verification' };
  }

  if (!session || session.user.is_phone_verified !== 1) {
    return { redirect: '/mobile-verification' };
  }
}

export async function callApi({ type, url, data = [], userToken }) {
  const response = await axios(
    `${process.env.NEXT_PUBLIC_BASE_URL_API}${url}`,
    {
      method: type,
      data: {
        ...data,
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
        userToken: userToken,
      },
    },
  );
    console.log(process.env.NEXT_PUBLIC_BASE_URL_API + url);

  return response.data;
}

export async function callVotlyApi({ type, url, data = [], userToken }) {
  const response = await axios(`${process.env.BACKEND_BASE_URL_API}${url}`, {
    method: type,
    data,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${userToken}`,
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
  return response.data;
}

export function apiSuccessResponse(data, message = '') {
  return {
    statusCode: 200,
    message,
    data,
  };
}

export function apiErrorResponse(errorCode, message = '') {
  return {
    errorCode: errorCode ?? 400,
    message,
  };
}
