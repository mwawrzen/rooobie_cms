import { t } from "elysia";

export const USER_ROLES= [ "ADMIN", "EDITOR" ] as const;
export type USER_ROLE= typeof USER_ROLES[ number ];

export const CreateUserBodySchema= t.Object({
  email: t.String({ format: "email", error: "Invalid email format" }),
  password: t.String({ minLength: 8, error: "Password must be at least 8 characters" })
});

export const UpdateUserBodySchema= t.Partial( CreateUserBodySchema );

export const LoginUserBodySchema= t.Object({
  email: t.String(),
  password: t.String()
});

export const UserPublicBodySchema= t.Object({
  id: t.Integer(),
  email: t.String(),
  role: t.UnionEnum( USER_ROLES ),
  createdAt: t.String()
});

export const IdParamSchema= t.Object({
  id: t.Numeric()
});

export type CreateUserBody= ( typeof CreateUserBodySchema )[ "static" ];

export type UpdateUserBody= ( typeof UpdateUserBodySchema )[ "static" ];

export type LoginUserBody= ( typeof LoginUserBodySchema )[ "static" ];

export type UserPublic= ( typeof UserPublicBodySchema )[ "static" ];

export type UserWithPassword= UserPublic& { passwordHash: string };
