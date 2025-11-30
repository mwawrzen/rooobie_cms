import { Elysia } from "elysia";
import { AccessDeniedError, UserUnauthorizedError } from "../modules/user/errors";

export const requiresAdmin= ( app: Elysia )=> app
  .onBeforeHandle(({ user }: any )=> {
    if( !user )
      throw new UserUnauthorizedError();

    if( user.role!== "ADMIN" )
      throw new AccessDeniedError( "Admin privileges required" );
  });
