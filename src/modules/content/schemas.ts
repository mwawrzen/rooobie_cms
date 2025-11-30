import { t } from "elysia";

export interface ContentVariable {
  id: number;
  projectId: number;
  key: string;
  value: string;
};

export const ContentVariableBodySchema= t.Object({
  key: t.String({ minLength: 1, maxLength: 50 }),
  value: t.String({ minLength: 0 })
});

export type ContentVariableBody=
  ( typeof ContentVariableBodySchema )[ "static "];
