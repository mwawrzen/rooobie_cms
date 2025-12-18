import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

const secret= process.env.JWT_SECRET!;

export const jwtConfig= jwt({
  name: "jwt",
  secret,
  exp: "1h"
});

export const authJwtPlugin= new Elysia({ name: "auth" })
  .use( jwtConfig );

export type AuthJwtPlugin= typeof authJwtPlugin;
