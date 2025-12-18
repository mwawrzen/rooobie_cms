import { Elysia } from "elysia";
import { authGuard } from "@auth/guard.middleware"
import { requiresAdmin } from "@auth/role.middleware";
import { authRouter } from "@v1/auth";
import { adminRouter } from "@v1/admin";
import { meRouter } from "@v1/me";
import { publicRouter } from "@v1/public";
import { projectRouter } from "@v1/project";

export const api= new Elysia({ prefix: "/api/v1" })
  .use( publicRouter)
  .use( authRouter )
  .use( authGuard )
  .use( projectRouter )
  .group( "/me", app=> app
    .use( meRouter )
  )
  .group( "/admin", app=> app
    .use( requiresAdmin )
    .use( adminRouter )
  );
