import axios from "axios";
import { User } from "../types/types";
import { UUID } from "crypto";

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

export const createUser = async (newUser: User): Promise<User> => {
  const apiUrl = "http://localhost:5001/api/users/signup";
  const userData = localStorage.getItem("userData");
  const token = userData ? JSON.parse(userData)?.token : null;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const body = JSON.stringify(newUser);

  try {
    const response = await axios.post(apiUrl, body, { headers });
    return response.data;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
};

export const deleteUser = async (
  userId: UUID | undefined
): Promise<{ massage: string }> => {
  const apiUrl = `http://localhost:5001/api/users/${userId}`;
  const userData = localStorage.getItem("userData");
  const token = userData ? JSON.parse(userData)?.token : null;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.delete(apiUrl, { headers });
    return response.data;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
};
