import { IdParamSchema } from "@/src/modules/project/schemas";
import { UserExistsError, UserNotFoundError } from "@/src/modules/user/errors";
import { deleteUser, getSafeUserById, getUsers } from "@/src/modules/user/repository";
import { LoginBodySchema } from "@/src/modules/user/schemas";
import { registerNewUser } from "@/src/modules/user/service";
import Elysia from "elysia";

export const userRouter= new Elysia({ prefix: "/user" })
  .get( "/", async ({ set })=> {
    try {
      const users= await getUsers();
      return { users };
    } catch( error ) {
      set.status= 500;
      return { error: "Failed to retrieve user list" };
    }
  })
  .get( "/:id", async ({ params })=> {
    const user= await getSafeUserById( params.id );

    if( !user )
      throw new UserNotFoundError();

    return { user };
  }, {
    params: IdParamSchema
  })
  .post( "/", async ({ body, set })=> {
    try {
      const { id, email, createdAt }= await registerNewUser(
        body.email,
        body.password
      );

      set.status= 201;

      return {
        message: "User created successfully",
        user: { id, email, createdAt }
      };

    } catch( error ) {

      if( error instanceof UserExistsError ) {
        set.status= 409;
        return {
          error: "Resource confilct",
          message: error.message
        };
      }

      set.status= 500;
      return { error: "Internal server error" };
    }
  }, {
    body: LoginBodySchema
  })
  .delete( "/:id", async ({ params, set, user }: any)=> {
    if( user&& user.id=== params.id ) {
      set.status= 403;
      return { error: "Admin cannot delete their own account via this endpoint" };
    }

    const deletedCount= await deleteUser( params.id );

    if( deletedCount=== 0 )
      throw new UserNotFoundError();

    set.status= 200;
    return { message: "User successfully deleted" };
  }, {
    params: IdParamSchema
  });
