import { and, eq } from "drizzle-orm";
import { db } from "@db";
import { contentVariables } from "@schema";
import { ContentVariable, ContentVariableBody } from "./schemas";

/**
 * Inserts content variable into database
 * @param {ContentVariableBody} data
 * @returns Inserted content variable
 */
async function insert( data: ContentVariableBody ): Promise<ContentVariable> {
  const [ contentVariable ]= await db.insert( contentVariables )
    .values( data )
    .returning();
  return contentVariable;
}

/**
 * Fetches all content variables in project from database
 * @param id Project id
 * @returns Array of content variables
 */
async function fetchByProjectId( id: number ): Promise<ContentVariable[]> {
  return db.query.contentVariables.findMany({
    where: eq( contentVariables.projectId, id )
  });
};

/**
 * Fetches content variable by key in project from database
 * @param id Project id
 * @param key Content variable key
 * @returns Array of projects
 */
async function fetchByKeyAndProjectId(
  id: number,
  key: string
): Promise<ContentVariable | undefined> {
  return await db.query.contentVariables.findFirst({
    where: and(
      eq( contentVariables.projectId, id ),
      eq( contentVariables.key, key )
    )
  });
};

/**
 * Updates content variable in project in database
 * @param id Project id
 * @param data Content variable new data
 * @returns ContentVariable
 */
async function update(
  id: number,
  data: ContentVariableBody
): Promise<ContentVariable> {
  const [ updatedVar ]= await db.update( contentVariables )
    .set( data )
    .where( eq( contentVariables.projectId, id ))
    .returning();
  return updatedVar;
}

/**
 * Removes content variable in project from database
 * @param id Project id
 * @param key Content variable key
 * @returns Number of removed variables (0 or 1)
 */
async function removeByKeyAndProjectId(
  id: number,
  key: string
): Promise<number> {
  const deleted= await db.delete( contentVariables )
    .where( and(
      eq( contentVariables.projectId, id ),
      eq( contentVariables.key, key )
    ))
    .returning();
  return deleted.length;
}

export const contentRepository= {
  insert,
  fetchByProjectId,
  fetchByKeyAndProjectId,
  update,
  removeByKeyAndProjectId
};

export type ContentRepository= typeof contentRepository;
