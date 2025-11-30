import { UserNotFoundError, UserUnauthorizedError } from "./errors";
import { insertNewUser, getUserByEmail, getUserById, updateUser } from "./repository";
import { AuthenticatedUser, SafeUser } from "./schemas";

/**
 * Encrypts password using bcrypt
 * @param password Plain password
 * @returns Hashed password
 */
export async function hashPassword( password: string ) {
  return await Bun.password.hash( password, { algorithm: "bcrypt" });
};

/**
 * Validates user credentials
 * @param email Email
 * @param password Password
 * @returns User
 * @throws {UserUnauthorizedError} If user is unathorized
 */
export async function validateUser(
  email: string,
  password: string
): Promise<AuthenticatedUser> {
  const user= await getUserByEmail( email );

  if( !user )
    throw new UserUnauthorizedError()

  const isPasswordValid= await Bun.password.verify(
    password,
    user.passwordHash
  );

  if( !isPasswordValid )
    throw new UserUnauthorizedError();

  const { passwordHash: _, ...safeUser }= user;

  return safeUser;
};

/**
 * Registers a new user
 * @param email Email
 * @param password Password
 * @returns New user object
 * @throws {UserExistsError} If email is occupied
 */
export async function registerNewUser( email: string, password: string ) {

  const passwordHash= await hashPassword( password );
  const newUser= await insertNewUser( email, passwordHash );

  return newUser;
};

export async function updateUserProfile(
  id: number,
  email?: string,
  password?: string
) {
  const data: { email?: string, passwordHash?: string }= {};

  const existingUser= await getUserById( id );

  if( !existingUser )
    throw new UserNotFoundError();

  if( password )
    data.passwordHash= await hashPassword( password );

  if( email )
    data.email= email;

  if( Object.keys( data ).length=== 0 ) {
    const { passwordHash: _, ...safeUser }= existingUser;
    return safeUser;
  }

  const updatedUser= await updateUser( id, data );

  if( !updatedUser )
    throw new Error( "Database integrity error during update" );

  return updatedUser;
};
