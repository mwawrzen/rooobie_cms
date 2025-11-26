import { Elysia, t } from "elysia";
import { authConfig } from "@auth/config";
import { validateUser } from "@modules/user/service";

export const authRouter= ( app: Elysia )=> app
  .use( authConfig )
  .post( "/login", async ({ body, jwt, set }: any)=> {

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
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String()
    })
  });
