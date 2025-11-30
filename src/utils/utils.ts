import { UserPublic, UserWithPassword } from "../modules/user/schemas";

export const createEnumObject= ( arr: readonly string[] )=> {
  return arr.reduce(( acc, curr )=> {
    acc[ curr ]= curr;
    return acc;
  }, {} as Record<string, string> );
};

export const removePasswordFromUser= ( user: UserWithPassword ): UserPublic=> {
  const { passwordHash: _, ...safeUser }= user;
  return safeUser;
};
