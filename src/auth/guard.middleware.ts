import { Elysia } from "elysia";
import { UserUnauthorizedError } from "@modules/user/errors";
import { userService } from "@modules/user/service";
import { UserPublic } from "@modules/user/schemas";
import { authJwtPlugin } from "@auth/jwt.plugin";

export const authGuard= ( app: Elysia )=> app
  .use( authJwtPlugin )
  .resolve( async ({ jwt, cookie: { auth }})=> {

    const token= auth.value;

    if( !token )
      return { user: null };

    try {
      const payload= await jwt.verify( token as string );

      if( !payload|| !payload.userId )
        return { user: null };

      const dbUser= await userService.getById( Number( payload.userId ));

      if( !dbUser )
        return { user: null };

      const user: UserPublic= {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        createdAt: dbUser.createdAt
      };

      return { user };
    } catch(_) {
      return { user: null };
    }
  })
  .onBeforeHandle(({ user })=> {
    if( !user )
      throw new UserUnauthorizedError();
  });
