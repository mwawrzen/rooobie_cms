import { Elysia } from "elysia";
import { authPlugin } from "@/src/auth/jwt.plugin";
import { getUserById } from "@modules/user/repository";
import { AuthenticatedUser } from "@modules/user/schemas";

export const authGuard= ( app: Elysia )=> app
  .use( authPlugin )
  .resolve( async ({ jwt, headers, set }) => {
    const authHeader= headers[ "authorization" ];

    if( !authHeader|| !authHeader.startsWith( "Bearer " )) {
      set.status= 401;
      return { error: "Missing or invalid authorization header" };
    }

    const token= authHeader.substring( 7 );
    const profile= await jwt.verify( token );

    if( !profile|| !profile.userId ) {
      set.status= 401;
      return { error: "Invalid or expired token" };
    }

    const dbUser= await getUserById( Number( profile.userId ));

    if( !dbUser ) {
      set.status= 401;
      return { error: "User in token not found" };
    }

    const user: AuthenticatedUser= {
      id: dbUser.id,
      email: dbUser.email,
      createdAt: dbUser.createdAt
    };

    return { user };
  });
