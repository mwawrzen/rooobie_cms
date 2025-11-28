import { Elysia } from "elysia";
import { UserExistsError } from "@modules/user/errors";
import { registerNewUser } from "@modules/user/service";
import { LoginBodySchema } from "@modules/user/schemas";
import { getUsers } from "@modules/user/repository";

export const adminRouter= new Elysia()
  .get( "/user", async ({ body, set })=> {
    try {
      const users= await getUsers();
      return { users };
    } catch( error ) {
      set.status= 500;
      return { error: "Failed to retrieve user list" };
    }
  })
  .post( "/user", async ({ body, set })=> {
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
  });
