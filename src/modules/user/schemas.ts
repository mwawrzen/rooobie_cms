import { t } from "elysia";

export const LoginBodySchema= t.Object({
  email: t.String({ format: "email", error: "Invalid email format" }),
  password: t.String({ minLength: 8, error: "Password must be at least 8 characters" })
});

export const UpdateProfileBodySchema= t.Object({
  email: t.Optional( t.String({ format: "email" })),
  password: t.Optional( t.String({ minLength: 8 }))
});

export type SafeUser= {
  id: number;
  email: string;
  createdAt: string;
};

export type AuthenticatedUser= {
  id: number;
  email: string;
};
