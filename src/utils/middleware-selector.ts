import { UNAUTHENTICATED_ROUTES } from "@/config/constants";
import AuthMiddleware from "@/middlewares/auth-middleware";
import { Middleware } from "@/types/middleware";

export type TMiddlewareSelector = (path: string) => Array<Middleware>;

export const middlewareSelector: TMiddlewareSelector = (path: string) => {
  if (UNAUTHENTICATED_ROUTES.includes(path)) return [];
  return [AuthMiddleware];
};
