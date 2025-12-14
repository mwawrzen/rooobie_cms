import { eq } from "drizzle-orm";
import { db } from "@db";
import { projects, userProjects } from "@schema";
import { CreateProjectBody, Project, UpdateProjectBody } from "@modules/project/schemas";
import { randomUUIDv7 } from "bun";
import { type USER_ROLE } from "@modules/user/schemas";

/**
 * Inserts project into database
 * @param {CreateProjectBody} data
 * @returns Inserted project
 */
async function insert(
  data: CreateProjectBody
): Promise<Project> {
  const [ project ]= await db.insert( projects )
    .values({
      ...data,
      apiKey: randomUUIDv7()
    })
    .returning();
  return project;
};

/**
 * Fetches all projects from database
 * @returns Array of projects
 */
async function fetchAll(): Promise<Project[]> {
  return db.select().from( projects );
};

/**
 * Fetches project from database by its id
 * @param id
 * @returns Project
 */
async function fetchById(
  id: number
): Promise<Project | undefined> {
  const project= await db.query.projects.findFirst({
    where: eq( projects.id, id )
  });
  return project;
};

/**
 * Updates project data in database
 * @param id
 * @param {UpdateProjectBody} data
 * @returns Updated project
 */
async function update(
  id: number,
  data: UpdateProjectBody
): Promise<Project> {
  const [ updatedProject ]= await db.update( projects )
    .set( data )
    .where( eq( projects.id, id ))
    .returning();
  return updatedProject;
};

/**
 * Updates project user roles in database
 * @param projectId
 * @param {{ userId: number, role: USER_ROLE }}updates
 */
async function updateProjectRoles(
  projectId: number,
  updates: { userId: number, role: USER_ROLE }[]
) {
  await db
    .delete( userProjects )
    .where( eq( userProjects.projectId, projectId ));

  if( updates.length> 0 ) {
    await db.insert( userProjects ).values(
      updates.map( u=> ({
        projectId,
        userId: u.userId,
        role: u.role
      }))
    );
  }
}

/**
 * Removes project from database by its id
 * @param id
 * @returns Number of removed projects (0 or 1)
 */
async function remove( id: number ): Promise<number> {

  const deletedProjects= await db.delete( projects )
    .where( eq( projects.id, id ))
    .returning();

  return deletedProjects.length;
};

export const projectRepository= {
  insert,
  fetchAll,
  fetchById,
  update,
  updateProjectRoles,
  remove
};

export type ProjectRepository= typeof projectRepository;
