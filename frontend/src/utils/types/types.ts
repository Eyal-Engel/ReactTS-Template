import { UUID } from "crypto";

export type User = {
  id: string;
  privateNumber: string;
  fullName: string;
  password: string;
  commandId: UUID;
  editPerm: boolean;
  managePerm: boolean;
};
