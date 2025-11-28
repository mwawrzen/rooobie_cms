import { Elysia } from "elysia";
import { authPlugin } from "@/src/auth/plugin";
import { validateUser } from "@modules/user/service";
import { LoginBodySchema } from "@modules/user/schemas";

export const authRouter= ( app: Elysia )=> app
  .use( authPlugin )
  .post( "/login", async ({ body, jwt, set })=> {

    const { email, password }= body;

    const user= await validateUser( email, password );

    if( !user ) {
      set.status= 401;
      return { error: "Invalid login data" };
    }

    const token= await jwt.sign({
      userId: user.id,
      email: user.email
    });

    return { token };
  }, {
    body: LoginBodySchema
  });
