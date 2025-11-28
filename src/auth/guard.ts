import { Elysia } from "elysia";
import { authPlugin } from "@/src/auth/plugin";
import { getUserById } from "@modules/user/repository";

export const authGuard= ( app: Elysia )=> app
  .use( authPlugin )
  .decorate( "user", null as { id: number, email: string }| null )
  .on( "beforeHandle", async ({ jwt, set, headers })=> {

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

    const dbUser= await getUserById( profile.userId );

    if( !dbUser ) {
      set.status= 401;
      return { error: "User in token not found" };
    }

    set.context.user= { id: dbUser.id, email: dbUser.email };
  });
