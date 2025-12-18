import Elysia from "elysia";
import { projectService } from "@modules/project/service";
import {
  CreateProjectBodySchema,
  IdParamSchema,
  UpdateProjectRolesBodySchema
} from "@modules/project/schemas";

export const adminProjectRouter= new Elysia({ prefix: "/project" })
  .post( "/", async ({ body, status })=> {
    const project= await projectService.create( body );
    return status( 201, project );
  }, {
    body: CreateProjectBodySchema
  })
  .get( "/", async ()=> {
    return await projectService.getAll();
  })
  .patch( ":id/roles", async ({ params: { id }, body, status })=> {
    await projectService.manageProjectRoles( id, body );
    return status( 204 );
  }, {
    body: UpdateProjectRolesBodySchema,
    params: IdParamSchema
  });
