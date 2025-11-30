import { eq } from "drizzle-orm";
import { db } from "@db";
import { users } from "@schema";
import { UserExistsError } from "@modules/user/errors";
import {
  UpdateUserBody,
  UserWithPassword,
  UserPublic
} from "@modules/user/schemas";

const safeUserColumns= {
  id: users.id,
  email: users.email,
  role: users.role,
  createdAt: users.createdAt
};

/**
 * Translates db error to system error
 */
function translateDbError( error: unknown, email?: string ): never {
  if(
    error instanceof Error&&
    error.message.includes( "SQLITE_CONSTRAINT: UNIQUE" )
  ) {
    throw new UserExistsError( email! );
  }
  throw error;
}

/**
 * Inserts user into database
 * @param email
 * @param passwordHash
 * @returns User
 * @throws {UserExistsError} If user with given email already exists
 */
async function insert(
  email: string,
  passwordHash: string
): Promise<UserPublic> {
  try {
    const [ user ]= await db.insert( users )
      .values({ email, passwordHash })
      .returning( safeUserColumns );

    return user;

  } catch(_) {
    throw new UserExistsError( email );
  }
};

/**
 * Fetches all users
 * @returns All users from database
 */
async function fetchAll(): Promise<UserPublic[]> {
  return await db.select( safeUserColumns ).from( users );
};

/**
 * Fetches user with password by id
 * @param id
 * @returns User with password
 */
async function fetchWithPasswordById(
  id: number
): Promise<UserWithPassword | undefined> {
  return await db.query.users.findFirst({
    where: eq( users.id, id )
  });
};

/**
 * Fetches user with password by email
 * @param email
 * @returns User with password
 */
async function fetchWithPasswordByEmail(
  email: string
): Promise<UserWithPassword | undefined> {
  return await db.query.users.findFirst({
    where: eq( users.email, email )
  });
};

/**
 * Fetches user by id
 * @param id
 * @returns User
 */
async function fetchById(
  id: number
): Promise<UserPublic | undefined> {

  const [ user ]= await db
    .select( safeUserColumns )
    .from( users )
    .where( eq( users.id, id ));

  return user;
};

/**
 * Updates user
 * @param id
 * @param {UpdateUserBody} data
 * @returns Updated user
 */
async function update(
  id: number,
  data: UpdateUserBody
): Promise<UserPublic> {
  const [ updatedUser ]= await db.update( users )
    .set( data )
    .where( eq( users.id, id ))
    .returning( safeUserColumns );

  return updatedUser;
};

/**
 * Removes user from database by its id
 * @param id
 * @returns Number of removed users (0 or 1)
 */
async function remove( id: number ): Promise<number> {

  const deletedUsers= await db.delete( users )
    .where( eq( users.id, id ))
    .returning( safeUserColumns );

  return deletedUsers.length;
};

export const userRepository= {
  insert,
  fetchAll,
  fetchWithPasswordById,
  fetchWithPasswordByEmail,
  fetchById,
  update,
  remove
};

export type UserRepository= typeof userRepository;
