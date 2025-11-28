import { Elysia } from "elysia";

export const requiresAdmin= ( app: Elysia )=> app
  .onBeforeHandle(({ set, user }: any )=> {

    if( !user ) {
      set.status= 401;
      return { error: "Authentication required" };
    }

    if( user.role!== "admin" ) {
      set.status= 403;
      return { error: "Access denied: Admin privileges required" };
    }
  });
