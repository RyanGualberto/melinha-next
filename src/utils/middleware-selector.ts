import { UNAUTHENTICATED_ROUTES } from "@/config/constants";
import AuthMiddleware from "@/middlewares/auth-middleware";
import RolesMiddleware from "@/middlewares/roles-middleware";
import { Middleware } from "@/types/middleware";

export type TMiddlewareSelector = (path: string) => Array<Middleware>;

export const middlewareSelector: TMiddlewareSelector = (path: string) => {
  if (UNAUTHENTICATED_ROUTES.includes(path)) return [];
  if (path.includes("/admin")) return [AuthMiddleware, RolesMiddleware];
  return [AuthMiddleware];
};
