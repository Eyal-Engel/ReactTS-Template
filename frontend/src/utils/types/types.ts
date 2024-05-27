import { UUID } from "crypto";

export type User = {
  id?: UUID;
  privateNumber: string;
  fullName: string;
  password: string;
  commandId: UUID;
  editPerm: boolean;
  managePerm: boolean;
};

export type Command = {
  id?: UUID;
  name: string;
  isNewSource: boolean;
};
