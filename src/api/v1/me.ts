import Elysia from "elysia";
import { IdParamSchema, UpdateUserBodySchema } from "@modules/user/schemas";
import { userService } from "@modules/user/service";

export const meRouter= new Elysia()
  .get( "/", ({ user }: any )=> {
    return user;
  })
  .patch( "/", async ({ body, user }: any )=> {
    return await userService.update( user.id, body );
  }, {
    body: UpdateUserBodySchema
  })
  .delete( "/", async ({ status, user }: any)=> {
    await userService.remove( user.id );
    return status( 204 );
  }, {
    params: IdParamSchema
  });
