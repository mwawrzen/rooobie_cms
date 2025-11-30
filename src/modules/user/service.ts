import { removePasswordFromUser } from "@utils";
import { AccessDeniedError, UserNotFoundError, UserUnauthorizedError } from "./errors";
import { CreateUserBody, UpdateUserBody, UserPublic } from "./schemas";
import { userRepository } from "./repository";

/**
 * Encrypts password using bcrypt
 * @param password Plain password
 * @returns Hashed password
 */
async function hashPassword( password: string ): Promise<string> {
  return await Bun.password.hash( password, { algorithm: "bcrypt" });
}

/**
 * Validates user credentials
 * @param email
 * @param password
 * @returns User
 * @throws {UserUnauthorizedError} If user is unathorized
 */
async function validate(
  email: string,
  password: string
): Promise<UserPublic> {

  const user= await userRepository.fetchWithPasswordByEmail( email );

  if( !user )
    throw new UserUnauthorizedError()

  const isPasswordValid= await Bun.password.verify(
    password,
    user.passwordHash
  );

  if( !isPasswordValid )
    throw new UserUnauthorizedError();

  return removePasswordFromUser( user );
}

/**
 * Creates new user
 * @param {CreateUserBody} data
 * @returns New user
 * @throws {UserExistsError} If email is occupied
 */
async function create(
  data: CreateUserBody
): Promise<UserPublic> {

  const passwordHash= await hashPassword( data.password );
  return await userRepository.insert( data.email, passwordHash );
}

/**
 * Returns all users
 * @returns Array of users
 */
async function getAll(): Promise<UserPublic[]> {
  return await userRepository.fetchAll();
}

/**
 * Returns user by id
 * @param id
 * @returns User
 * @throws {UserNotFoundError} If user does not exist
 */
async function getById( id: number ): Promise<UserPublic> {
  const user= await userRepository.fetchById( id );

  if( !user )
    throw new UserNotFoundError( id );

  return user;
}

/**
 * Updates user
 * @param id
 * @param {UpdateUserBody} data
 * @returns Updated user
 */
async function update(
  id: number,
  { email, password }: UpdateUserBody
): Promise<UserPublic> {

  const newData: { email?: string, passwordHash?: string }= {};

  if( email )
    newData.email= email

  if( password )
    newData.passwordHash= await userService.hashPassword( password );

  const updatedUser= await userRepository.update( id, newData );

  if( !updatedUser )
    throw new UserNotFoundError( id );

  return updatedUser;
}

/**
 * Removes user
 * @param id
 * @throws {UserNotFoundError} If user does not exist
 */
async function remove( id: number ): Promise<void> {

  const user= await userRepository.fetchById( id );

  if( !user )
    throw new UserNotFoundError( id );

  if( user.role=== "ADMIN" )
    throw new AccessDeniedError( "Admin account cannot be deleted" );

  const result= await userRepository.remove( id );

  if( result=== 0 )
    throw new UserNotFoundError( id );
}

export const userService= {
  hashPassword,
  validate,
  create,
  getAll,
  getById,
  update,
  remove
};
