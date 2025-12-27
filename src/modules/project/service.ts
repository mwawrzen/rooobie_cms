import { userService } from "@modules/user/service";
import { ProjectNotFoundError, ProjectUserNotFoundError } from "./errors";
import { projectRepository } from "./repository";
import {
  CreateProjectBody,
  UpdateProjectBody,
  UpdateProjectRolesBody,
  Project
} from "./schemas";

/**
 * Creates new project
 * @param {CreateProjectBody} data
 * @returns New project
 */
async function create(
  data: CreateProjectBody
): Promise<Project> {
  return await projectRepository.insert( data );
}

/**
 * Returns all projects
 * @returns Array of projects
 */
async function getAll(): Promise<Project[]> {
  return await projectRepository.fetchAll();
}

/**
 * Returns project by its id
 * @param id
 * @returns Project
 * @throws {ProjectNotFoundError} If project does not exist
 */
async function getById(
  id: number
): Promise<Project> {
  const project= await projectRepository.fetchById( id );

  if( !project )
    throw new ProjectNotFoundError( id );

  return project;
}

/**
 * Updates project
 * @param id
 * @param {UpdateProjectBody} data
 * @returns Updated project
 * @throws {ProjectNotFoundError} If project does not exist
 */
async function update(
  id: number,
  data: UpdateProjectBody
): Promise<Project> {
  const updatedProject= await projectRepository.update( id, data );

  if( !updatedProject )
    throw new ProjectNotFoundError( id );

  return updatedProject;
}

/**
 * Removes project
 * @param id
 * @throws {ProjectNotFoundError} If project does not exist
 */
async function remove( id: number ): Promise<void> {
  const result= await projectRepository.remove( id );

  if( result=== 0 )
    throw new ProjectNotFoundError( id );
}

/**
 * Returns project users
 * @param projectId
 * @returns project users
 */
async function getProjectUsers(
  projectId: number
) {
  return await projectRepository.fetchProjectUsers( projectId );
}

/**
 * Updates project user roles
 * @param projectId
 * @param {UpdateProjectRolesBody} data
 */
async function updateProjectUsers(
  projectId: number,
  data: UpdateProjectRolesBody
) {
  await Promise.all([
    await getById( projectId ),
    await userService.getById( data.userId )
  ]);
  await projectRepository.updateProjectUsers( projectId, data );
  return;
}

async function removeProjectUser(
  userId: number,
  projectId: number
): Promise<void> {
  const result= await projectRepository.removeProjectUser( userId, projectId );

  if( result=== 0 )
    throw new ProjectUserNotFoundError( userId );
}

export const projectService= {
  create,
  getAll,
  getById,
  update,
  remove,
  getProjectUsers,
  updateProjectUsers,
  removeProjectUser
};

export type ProjectService= typeof projectService;
