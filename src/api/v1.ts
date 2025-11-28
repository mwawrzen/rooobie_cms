import { Elysia } from "elysia";
import { authGuard } from "@auth/guard.middleware"
import { requiresAdmin } from "@auth/role.middleware";
import { authRouter } from "@v1/auth";
import { adminRouter } from "@v1/admin";
import { userRouter } from "./v1/user";

export const apiV1= new Elysia({ prefix: "/api/v1" })
  .use( authRouter )
  .group( "", app=> app
    .use( authGuard )
    .use( userRouter )
  )
  .group( "/admin", app=> app
    .use( authGuard )
    .use( requiresAdmin )
    .use( adminRouter )
  );
