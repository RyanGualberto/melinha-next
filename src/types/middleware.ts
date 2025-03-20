import { NextRequest, NextResponse } from "next/server";

export type CustomMiddlewareResponse = {
  response: NextResponse;
  halt: boolean;
};

export type Middleware = (
  request: NextRequest,
  response: NextResponse
) => Promise<CustomMiddlewareResponse | undefined>;
