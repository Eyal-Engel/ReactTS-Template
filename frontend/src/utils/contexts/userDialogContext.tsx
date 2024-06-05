import React, { createContext, useContext, useState } from "react";
import { User } from "../types/types";
type UserDialogContextProps = {
  openUserDialog: boolean;
  open: () => void;
  close: () => void;
  setUserToEdit: React.Dispatch<React.SetStateAction<User | undefined>>;
  userToEdit: User | undefined;
};
const UserDialogContext = createContext<UserDialogContextProps | undefined>(
  undefined
);

type UserDialogProviderProps = {
  children: React.ReactNode;
};

export const UserDialogProvider = ({ children }: UserDialogProviderProps) => {
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const open = () => setOpenUserDialog(true);
  const close = () => {
    setOpenUserDialog(false);
    setUserToEdit(undefined);
  };

  return (
    <UserDialogContext.Provider
      value={{ openUserDialog, open, close, setUserToEdit, userToEdit }}
    >
      {children}
    </UserDialogContext.Provider>
  );
};

export const useUserDialog = (): UserDialogContextProps => {
  const context = useContext(UserDialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
