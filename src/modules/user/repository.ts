import { eq } from "drizzle-orm";
import { db } from "@db";
import { users } from "@schema";
import { UserExistsError } from "@modules/user/errors";
import { SafeUser } from "@modules/user/schemas";

const safeUserColumns= {
  id: users.id,
  email: users.email,
  role: users.role,
  createdAt: users.createdAt
};

/**
 * Translates db error to system error
 */
function translateDbError( error: unknown ): never {
  if(
    error instanceof Error&&
    error.message.includes( "SQLITE_CONSTRAINT: UNIQUE" )
  ) {
    throw new UserExistsError();
  }
  throw error;
}

/**
 * Creates a new user in database
 * @param email New user email
 * @param passwordHash Hashed password of the new user
 * @returns User object (without hash) or null
 * @throws {UserExistsError} If user with email already exists
 */
export async function insertNewUser( email: string, passwordHash: string ) {
  try {
    const result= await db.insert( users )
      .values({
        email,
        passwordHash
      })
      .returning();

    const newUser= result[ 0 ];

    if( newUser ) {
      const { passwordHash: _, ...safeUser }= newUser;
      return safeUser;
    }

    throw new Error( "Database operation failed: insertNewUser returned empty result" );
  } catch( error ) {
    translateDbError( error );
  }
};

/**
 * Returns all users
 * @returns All users from db
 */
export async function getUsers() {
  const allUsers: SafeUser[]= await db.select( safeUserColumns ).from( users );
  return allUsers;
}

/**
 * Returns user by id
 * @param id User id
 * @returns User object
 */
export async function getUserById( id: number ) {
  return await db.query.users.findFirst({
    where: eq( users.id, id )
  });
};

/**
 * Returns safe user by id
 * @param id User id
 * @returns Safe user object
 */
export async function getSafeUserById(
  id: number
): Promise<SafeUser | undefined> {

  const userList= await db.select( safeUserColumns )
    .from( users )
    .where( eq( users.id, id ));

  return userList[ 0 ];
};

/**
 * Returns user by email address
 * @param email User email
 * @returns User object or null
 */
export async function getUserByEmail( email: string ) {
  return await db.query.users.findFirst({
    where: eq( users.email, email )
  });
};

/**
 * Updates user data
 * @param id User id
 * @param data New data (email and/or password)
 * @returns Updated user object
 */
export async function updateUser(
  id: number,
  data: { email?: string, passwordHash?: string }
) {
  try {
    const result= await db.update( users )
      .set( data )
      .where( eq( users.id, id ))
      .returning();

    const updatedUser= result[ 0 ];

    if( updatedUser ) {
      const { passwordHash: _, ...safeUser }= updatedUser;
      return safeUser;
    }
  } catch( error ) {
    translateDbError( error );
  }
};

/**
 * Deletes user by id from db
 * @param id User id
 * @returns Number of deleted rows in db
 */
export async function deleteUser( id: number ): Promise<number> {

  const result= await db.delete( users )
    .where( eq( users.id, id ))
    .run();

  return ( result as unknown as { changes: number }).changes;
}
