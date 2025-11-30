import { eq } from "drizzle-orm";
import { db } from "@db";
import { projects } from "@schema";
import { CreateProjectBody, Project, UpdateProjectBody } from "@modules/project/schemas";
import { randomUUIDv7 } from "bun";

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
  remove
};

export type ProjectRepository= typeof projectRepository;
