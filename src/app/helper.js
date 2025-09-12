import axios from 'axios';

export async function getUserToken(session) {
  if (session?.id) {
    return session.id;
  }
}
export function isUserCountryAllowed(user) {
  const allowedCountryIds = [188, 227, 112, 17, 159, 172, 63, 98, 3, 142];
  return allowedCountryIds.includes(user?.country_id);
}

export async function redirectIfEmailPhoneNotVerified(session) {
  if (!session?.id) {
    return { redirect: '/' };
  }

  const allowedCountryIds = [188, 227, 112, 17, 159, 172, 63, 98, 3, 142];
  if (!allowedCountryIds.includes(session?.user?.country_id)) {
    return;
  }

  if (session?.user?.is_email_verified !== 1) {
    return { redirect: '/email-verification' };
  }

  if (session?.user?.is_phone_verified !== 1) {
    return { redirect: '/mobile-verification' };
  }

  // Skip profile completion check if user has no SynoId and SynoToken
  if (!session?.user?.syno_id && !session?.user?.syno_token) {
    return; // Skip profile completion for users without Syno credentials
  }

  if (session?.user?.is_profile_completed !== 1) {
    return { redirect: '/complete-profile' };
  }
}

export async function callApi({
  type,
  url,
  data = [],
  userToken,
  lang = 'en',
}) {
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
        lang: lang,
      },
    },
  );

  return response.data;
}

export async function callVotlyApi({ type, url, data = [], userToken, lang }) {
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
      Language: lang,
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
