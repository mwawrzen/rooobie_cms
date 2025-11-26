import { eq } from "drizzle-orm";
import { db } from "@db";
import { users } from "@schema";

/**
 * Fetch user by email address
 * @param email User email
 * @returns User object or null
 */
export async function getUserByEmail( email: string ) {
  return await db.query.users.findFirst({
    where: eq( users.email, email )
  });
};
