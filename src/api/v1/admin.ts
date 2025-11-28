import { Elysia } from "elysia";
import { UserExistsError, UserNotFoundError } from "@modules/user/errors";
import { registerNewUser, updateUserProfile } from "@modules/user/service";
import { LoginBodySchema, UpdateProfileBodySchema } from "@modules/user/schemas";

export const adminRouter= new Elysia()
  .post( "/users", async ({ body, set })=> {
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
  .get( "/me", async ({ user }: any )=> {
    return user;
  })
  .patch( "/me", async ({ body, set, user }: any )=> {
    const userId= user.id;

    if( !body.email&& !body.password ) {
      set.status= 400;
      return { error: "No data provided for update" };
    }

    try {
      const updatedUser= await updateUserProfile(
        userId,
        body.email,
        body.password
      );

      return {
        message: "Profile updated successfully",
        user: updatedUser
      };

    } catch( error ) {

      if( error instanceof UserExistsError ) {
        set.status= 409;
        return { error: "Resource conflict", message: "Email already in use" };
      }

      if( error instanceof UserNotFoundError ) {
        set.status= 404;
        return { error: "Not found", message: "User profile not found" };
      }

      set.status= 500;

      return {
        error: "Internal server error",
        message: ( error as Error ).message
      };
    }
  }, {
    body: UpdateProfileBodySchema
  });
