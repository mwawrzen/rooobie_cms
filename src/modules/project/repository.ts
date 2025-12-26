import { randomUUIDv7 } from "bun";
import { and, eq } from "drizzle-orm";
import { db } from "@db";
import { projects, userProjects } from "@schema";
import { type USER_ROLE } from "@modules/user/schemas";
import {
  CreateProjectBody,
  UpdateProjectBody,
  Project
} from "@modules/project/schemas";
import { userService } from "../user/service";

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

/**
 * Fetches project users
 * @param projectId
 * @returns Project role for exact user or undefined
 */
async function fetchProjectUsers(
  projectId: number
): Promise<{ userId: number, projectId: number, role: USER_ROLE }[]> {
  const access= await db.query.userProjects.findMany({
    where: and(
      eq( userProjects.projectId, projectId )
    )
  });

  return access;
}

/**
 * Updates project user roles in database
 * @param projectId
 * @param {{ userId: number, role: USER_ROLE }} data
 */
async function updateProjectUsers(
  projectId: number,
  data: { userId: number, role: USER_ROLE }
) {
  await db.insert( userProjects ).values({ projectId, ...data });
}

export const projectRepository= {
  insert,
  fetchAll,
  fetchById,
  update,
  remove,
  updateProjectUsers,
  fetchProjectUsers
};

export type ProjectRepository= typeof projectRepository;
