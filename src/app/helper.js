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
  // Use Next.js API routes instead of calling backend directly
  // This avoids CORS issues since requests go through the same origin
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const apiUrl = `${baseUrl}/api/${url}`;
  
  const response = await axios(
    apiUrl,
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
  const baseUrl = process.env.BACKEND_BASE_URL_API;
  
  if (!baseUrl) {
    console.error('BACKEND_BASE_URL_API is not defined in environment variables');
    throw new Error('BACKEND_BASE_URL_API environment variable is not set');
  }
  
  // Ensure baseUrl ends with / and url doesn't start with /
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  const fullUrl = `${cleanBaseUrl}${cleanUrl}`;
  
  const response = await axios(fullUrl, {
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

// CORS headers helper function
export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, userToken',
  };
}
