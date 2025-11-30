import { Elysia } from "elysia";
import { authJwtPlugin } from "@auth/jwt.plugin";
import { validateUser } from "@modules/user/service";
import { LoginBodySchema } from "@modules/user/schemas";

export const authRouter= new Elysia()
  .use( authJwtPlugin )
  .post( "/login", async ({ body, jwt, cookie: { auth }})=> {

    const { email, password }= body;
    const user= await validateUser( email, password );

    const token= await jwt.sign({
      userId: user.id,
      email: user.email
    });

    auth.set({
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV=== "production",
      maxAge: 60* 60,
      path: "/"
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }, {
    body: LoginBodySchema
  })
  .get( "/logout", ({ status, cookie: { auth }})=> {
    auth.remove();
    return status( 204 );
  });
