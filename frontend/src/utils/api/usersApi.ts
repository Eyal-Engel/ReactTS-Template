import { User } from "../types/types";

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch("http://localhost:5001/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const getUserById = async (userId: string): Promise<User> => {
  const response = await fetch(`http://localhost:5001/api/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user ${userId}`);
  }
  return response.json();
};
