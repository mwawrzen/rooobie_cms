import Elysia from "elysia";
import { authRouter } from "@v1/auth";
import { authGuard } from "@/src/auth/guard"

export const apiV1= new Elysia({ prefix: "/api/v1" })
  .use( authRouter )
  .group( "/admin", app=> app
    .use( authGuard )
  )
