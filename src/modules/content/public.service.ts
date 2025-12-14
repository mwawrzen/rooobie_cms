import { contentRepository } from "@modules/content/repository";
import { ContentVariable } from "@modules/content/schemas";

/**
 * Returns all content variables
 * @param id Project id
 */
async function getAll(
  id: number,
): Promise<ContentVariable[]> {
  return contentRepository.fetchByProjectId( id );
}

export const contentPublicService = {
  getAll
};
