import { Elysia, t } from "elysia";
import { authConfig } from "@auth/config";

export const authRouter= ( app: Elysia )=> app
  .use( authConfig )
  .post( "/login", async ({ body, jwt, set })=> {

    const { email, password }= body as any;

    if( email!== "admin@example.com"|| password!== "admin123" ) {
      set.status= 401;
      return { error: "Wrong login data" };
    }

    const token= await jwt.sign({
      userId: 1,
      email
    });

    return { token };
  }, {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String()
    })
  });
