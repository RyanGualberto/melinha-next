import { NextRequest, NextResponse } from "next/server";
import { IUser } from "./user";

export type CustomMiddlewareResponse = {
  response: NextResponse;
  halt: boolean;
  user?: IUser;
};

export type Middleware = (
  request: NextRequest,
  response: NextResponse
) => Promise<CustomMiddlewareResponse | undefined>;
