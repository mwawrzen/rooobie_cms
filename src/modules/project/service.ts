import { ProjectNotFoundError } from "./errors";
import { projectRepository } from "./repository";
import { CreateProjectBody, Project, UpdateProjectBody } from "./schemas";

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

export const projectService= {
  create,
  getAll,
  getById,
  update,
  remove
};

export type ProjectService= typeof projectService;
