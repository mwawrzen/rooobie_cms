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
  .guard(({ params: IdParamSchema }), app=> app
    .group( "/:id", app=> app
      .get( "/users", async ({ params: { id }})=> {
        return await projectService.getProjectUsers( id );
      })
      .patch( "/users", async ({ params: { id }, body, status })=> {
        await projectService.updateProjectUsers( id, body );
        return status( 204 );
      }, {
        body: UpdateProjectRolesBodySchema
      })
    )
  );
