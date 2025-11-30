import Elysia from "elysia";
import { CreateUserBodySchema, IdParamSchema } from "@modules/user/schemas";
import { userService } from "@modules/user/service";
import { AccessDeniedError } from "@/src/modules/user/errors";

export const userRouter= new Elysia({ prefix: "/user" })
  .post( "/", async ({ body, status })=> {
    const user= await userService.create( body );
    return status( 201, user );
  }, {
    body: CreateUserBodySchema
  })
  .get( "/", async ()=> {
      return await userService.getAll();
  })
  .get( "/:id", async ({ params: { id }})=> {
    return await userService.getById( id );
  }, {
    params: IdParamSchema
  })
  .delete( "/:id", async ({ params: { id }, status, user }: any )=> {

    if( user&& user.id=== id )
      throw new AccessDeniedError();

    await userService.remove( id );
    return status( 204 );
  }, {
    params: IdParamSchema
  });
