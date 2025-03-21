import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const sendToClientApp = (request: NextRequest) => {
  const url = request.nextUrl.clone();
  url.pathname = "/";

  const response = NextResponse.redirect(url);

  return {
    response: response,
    halt: true,
  };
};

const RolesMiddleware = async (
  request: NextRequest,
  response: NextResponse
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const user_response = await fetch(`http://localhost:4444/auth/me`, {
      method: "GET",
      headers: headers,
    });

    const body = await user_response.json();

    if (body.role !== "admin") {
      return sendToClientApp(request);
    }

    return {
      response: response,
      halt: false,
    };
  } catch {
    return sendToClientApp(request);
  }
};

export default RolesMiddleware;
