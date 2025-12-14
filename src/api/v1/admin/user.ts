import Elysia from "elysia";
import { userService } from "@modules/user/service";
import {
  CreateUserBodySchema,
  UpdateUserBodySchema,
  IdParamSchema
} from "@modules/user/schemas";

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
  .patch( "/:id", async ({ params: { id }, body }: any )=> {
    return await userService.update( id, body );
  }, {
    body: UpdateUserBodySchema,
    params: IdParamSchema
  })
  .delete( "/:id", async ({ params: { id }, status }: any )=> {
    await userService.remove( id );
    return status( 204 );
  }, {
    params: IdParamSchema
  });
