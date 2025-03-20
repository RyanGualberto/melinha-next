import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const sendToLogin = (request: NextRequest) => {
  const url = request.nextUrl.clone();
  url.pathname = "/login";

  const response = NextResponse.redirect(url);

  return {
    response: response,
    halt: true,
  };
};

const AuthMiddleware = async (request: NextRequest, response: NextResponse) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return sendToLogin(request);
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const user_response = await fetch(`http://localhost:3001/me`, {
      method: "GET",
      headers: headers,
    });

    const isUnauthorized = user_response.status !== 200;
    if (isUnauthorized) return sendToLogin(request);

    return {
      response: response,
      halt: false,
    };
  } catch (error) {
    console.error("error", error);
    sendToLogin(request);
  }
};

export default AuthMiddleware;
