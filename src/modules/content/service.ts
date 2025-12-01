import { UserPublic } from "../user/schemas";
import { ContentVariableNotFoundError, ProjectAccessDeniedError } from "./errors";
import { contentRepository } from "./repository";
import { ContentVariable, ContentVariableBody } from "./schemas";

/**
 * Check if user has access to project
 * @param user
 * @param id Project id
 * @throws {ProjectAccessDeniedError} If user does not have an access
 */
function checkProjectAccess( user: UserPublic, id: number ): void {
  if( user.role!== "ADMIN" )
    throw new ProjectAccessDeniedError( id );
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
  checkProjectAccess( user, id );
  return contentRepository.insert( data );
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
  checkProjectAccess( user, id );
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
  checkProjectAccess( user, id );
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
  checkProjectAccess( user, id );
  const deletedCount= await contentRepository.removeByKeyAndProjectId( id, key );

  if( deletedCount=== 0 )
    throw new ContentVariableNotFoundError( key );
}

export const contentService= {
  checkProjectAccess,
  create,
  getAll,
  update,
  remove
};

export type ContentService= typeof contentService;
