import { UserExistsError, UserNotFoundError } from "@modules/user/errors";
import { registerNewUser, updateUserProfile } from "@modules/user/service";
import { Elysia, t } from "elysia";

const CreateUserBody= t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 })
});

const UpdateUserBody= t.Object({
  email: t.Optional(t.String({ format: "email" })),
  password: t.Optional(t.String({ minLength: 8 }))
});

export const adminRouter= new Elysia({ prefix: "/admin" })
  .post( "/users", async ({ body, set })=> {
    try {
      const newUser= await registerNewUser( body.email, body.password );

      set.status= 201;

      return {
        message: "User created successfully",
        user: { id: newUser.id, email: newUser.email }
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
    body: CreateUserBody
  })
  .get( "/me", async ({ store }: any)=> {
    return store.user;
  })
  .patch( "/me", async ({ body, store, set }: any)=> {
    const userId= store.user.id;

    if( !body.email&& !body.password ) {
      set.status= 400;
      return { error: "No data provided for update" };
    }

    try {
      const updatedUser= await updateUserProfile( userId, body.email, body.password );

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
  });
