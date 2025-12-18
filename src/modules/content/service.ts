import { UserPublic } from "@modules/user/schemas";
import { contentRepository } from "@modules/content/repository";
import { ContentVariable, ContentVariableBody } from "@modules/content/schemas";
import { projectRepository } from "@modules/project/repository";
import {
  ContentVariableNotFoundError,
  ProjectAccessDeniedError
} from "@modules/content/errors";

/**
 * Check if user has access to project
 * @param user
 * @param projectId
 * @throws {ProjectAccessDeniedError} If user does not have an access
 */
async function checkProjectAccess(
  user: UserPublic,
  projectId: number
): Promise<void> {
  if( user.role=== "ADMIN" )
    return;

  const projectRole=
    await projectRepository.fetchProjectRole( user.id, projectId );

  if( projectRole!== "EDITOR" )
    throw new ProjectAccessDeniedError( projectId );
}

/**
 * Creates content variable
 * @param id
 * @param data Content variable data
 * @param user
 * @returns New content variable
 */
async function create(
  id: number,
  data: ContentVariableBody,
  user: UserPublic
): Promise<ContentVariable> {
  await checkProjectAccess( user, id );
  return contentRepository.insert( id, data );
}

/**
 * Returns all content variables
 * @param id Project id
 * @param user
 */
async function getAll(
  id: number,
  user: UserPublic
): Promise<ContentVariable[]> {
  await checkProjectAccess( user, id );
  return contentRepository.fetchByProjectId( id );
}

/**
 * Updates content variable
 * @param id
 * @param data Content variable new data
 * @param user
 * @returns Updated content variable
 */
async function update(
  id: number,
  data: ContentVariableBody,
  user: UserPublic
): Promise<ContentVariable> {
  await checkProjectAccess( user, id );
  return await contentRepository.update( id, data );
}

/**
 * Removes content variable
 * @param id
 * @param data Content variable new data
 * @param user
 * @returns Updated content variable
 */
async function remove(
  id: number,
  key: string,
  user: UserPublic
): Promise<void> {
  await checkProjectAccess( user, id );
  const deletedCount= await contentRepository.removeByKeyAndProjectId( id, key );

  if( deletedCount=== 0 )
    throw new ContentVariableNotFoundError( key );
}

export const contentService= {
  create,
  getAll,
  update,
  remove,
  checkProjectAccess
};

export type ContentService= typeof contentService;
