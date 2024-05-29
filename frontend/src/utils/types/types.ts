import { UUID } from "crypto";

export type User = {
  id?: UUID;
  privateNumber: string;
  fullName: string;
  password: string;
  confirmPassword?: string;
  commandId: UUID;
  command?: string;
  editPerm: boolean;
  managePerm: boolean;
};

export type Command = {
  id?: UUID;
  name: string;
  isNewSource: boolean;
};
