import Elysia from "elysia";
import { projectService } from "@modules/project/service";
import {
  CreateProjectBodySchema,
  UpdateProjectBodySchema,
  IdParamSchema
} from "@/src/modules/project/schemas";
import { projectVariablesRouter } from "@v1/admin/project.variables";

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
  .guard({ params: IdParamSchema }, app=> app
    .group( "/:id", app=> app
      .get( "/", async ({ params: { id }})=> {
        return await projectService.getById( id );
      })
      .patch( "/", async ({ params: { id }, body }) => {
        return await projectService.update( id, body );
      }, {
        body: UpdateProjectBodySchema
      })
      .patch( "/roles", async ({ params: { id }, body, status })=> {
        await projectService.manageProjectRoles( id, body );
        return status( 204 );
      }, {
        body: UpdateProjectBodySchema
      })
      .delete( "/", async ({ params: { id }, status })=> {
        await projectService.remove( id );
        return status( 204 );
      })
      .use( projectVariablesRouter )
    )
  );
