import Elysia from "elysia";
import { projectService } from "@/src/modules/project/service";
import {
  CreateProjectBodySchema,
  UpdateProjectBodySchema,
  IdParamSchema
} from "@/src/modules/project/schemas";

export const projectRouter= new Elysia({ prefix: "/project" })
  .post( "/", async ({ body, status })=> {
    const project= await projectService.create( body );
    return status( 201, project );
  }, {
    body: CreateProjectBodySchema
  })
  .get( "/", async ()=> {
    return await projectService.getAll();
  })
  .get( "/:id", async ({ params: { id }})=> {
    return await projectService.getById( id );
  }, {
    params: IdParamSchema
  })
  .patch( "/:id", async ({ params: { id }, body }) => {
    return await projectService.update( id, body );
  }, {
    body: UpdateProjectBodySchema,
    params: IdParamSchema
  })
  .delete( "/:id", async ({ params: { id }, status })=> {
    await projectService.remove( id );
    return status( 204 );
  }, {
    params: IdParamSchema
  });
