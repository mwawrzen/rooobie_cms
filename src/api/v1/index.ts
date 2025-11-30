import { Elysia } from "elysia";
import { authGuard } from "@auth/guard.middleware"
import { requiresAdmin } from "@auth/role.middleware";
import { authRouter } from "@v1/auth";
import { adminRouter } from "@/src/api/v1/admin";
import { meRouter } from "./me";

export const api= new Elysia({ prefix: "/api/v1" })
  .use( authRouter )
  .use( authGuard )
  .group( "/me", app=> app
    .use( meRouter )
  )
  .group( "/admin", app=> app
    .use( requiresAdmin )
    .use( adminRouter )
  );
