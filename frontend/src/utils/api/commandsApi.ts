import axios from "axios";
import { Command } from "../types/types";

const port = process.env.REACT_APP_API_PORT || 5000;

export const getCommands = async (): Promise<Command[]> => {
  const response = await fetch("http://localhost:5001/api/commands");
  if (!response.ok) {
    throw new Error("Failed to fetch commands");
  }
  return response.json();
};

// export async function getAllCommandsNames() {
//   try {
//     const commandsNames = [];
//     const commands = await getCommands();

//     for (let i = 0; i < commands.length; i++) {
//       commandsNames.push(commands[i].commandName);
//     }
//     return commandsNames;
//   } catch (error) {
//     console.error("Error getting all commands names: ", error);
//     throw error;
//   }
// }

// export async function getCommandById(commandId) {
//   const apiUrl = `http://localhost:${port}/api/commands/${commandId}`;

//   const headers = {
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Headers":
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization",
//     "Access-Control-Allow-Methods": "GET",
//   };

//   try {
//     const response = await axios.get(apiUrl, headers);
//     return response.data;
//   } catch (error) {
//     console.error(`Error getting command by id: ${commandId}:`, error);
//     throw error;
//   }
// }

// export async function getCommandIdByName(commandName) {
//   try {
//     const commands = await getCommands();

//     for (let i = 0; i < commands.length; i++) {
//       if (commands[i].commandName === commandName) {
//         return commands[i].id;
//       }
//     }

//     // If no matching commandName is found
//     return null;
//   } catch (error) {
//     console.error("Error getting commandId by name:", error);
//     throw error; // Rethrow the error to handle it in the calling code
//   }
// }

// export async function getCommandNameById(commandId) {
//   try {
//     const command = await getCommandById(commandId);

//     return command.commandName;
//   } catch (error) {
//     console.error("Error getting command name by id:", error);
//     throw error; // Rethrow the error to handle it in the calling code
//   }
// }

export const createCommand = async (command: Command): Promise<Command> => {
  const apiUrl = "http://localhost:5001/api/commands";
  const userData = localStorage.getItem("userData");
  const token = userData ? JSON.parse(userData)?.token : null;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const body = JSON.stringify(command);

  try {
    const response = await axios.post(apiUrl, body, { headers });
    return response.data;
  } catch (error) {
    console.error("Error creating new command:", error);
    throw error;
  }
};
// export async function updateCommandById(userId, commandId, commandName) {
//   const apiUrl = `http://localhost:${port}/api/commands/${commandId}`;

//   const headers = {
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Headers":
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization",
//     "Access-Control-Allow-Methods": "PATCH",
//     Authorization:
//       "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
//   };

//   const body = JSON.stringify({ commandName, userId });

//   try {
//     const response = await axios.patch(apiUrl, body, headers);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     console.error(`Error updating command with id ${commandId}:`, error);
//     throw error;
//   }
//   // } else {
//   //   const error = { body: { errors: [{ message: "User is not authorized" }] } };
//   //   throw error;
//   // }
// }

// // frontend code
// export async function deleteCommandById(userId, commandId) {
//   const apiUrl = `http://localhost:${port}/api/commands/${commandId}`;

//   const headers = {
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Headers":
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization",
//     "Access-Control-Allow-Methods": "DELETE",
//     Authorization:
//       "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
//   };

//   const body = JSON.stringify({ userId }); // Include userId in the body

//   try {
//     const response = await axios.del(apiUrl, headers, body); // Pass the body parameter to the del function
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     console.error(`Error deleting command with id ${commandId}:`, error);
//     throw error;
//   }
// }
