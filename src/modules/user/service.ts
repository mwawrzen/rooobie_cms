import { getUserByEmail } from "./repository";

export async function validateUser( email: string, password: string ) {

  const user= await getUserByEmail( email );

  if( !user )
    return null;

  const isPasswordValid= await Bun.password.verify(
    password,
    user.passwordHash
  );

  if( !isPasswordValid )
    return null;

  const { passwordHash, ...safeUser }= user;

  return safeUser;
};

export async function hashPassword( password: string ) {
  return await Bun.password.hash( password, { algorithm: "bcrypt" });
};
