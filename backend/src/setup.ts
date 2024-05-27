import crypto from "crypto";
import Command from "./models/schemas/Command";
import User from "./models/schemas/User";

export const createAdminUser = async () => {
  // Export the function
  try {
    // Hash the password with SHA-256
    const hash = crypto.createHash("sha256");
    hash.update("Aa123456");
    const hashedPassword = hash.digest("hex");

    // Create the command
    const command = await Command.create({
      name: "ניהול",
      isNewSource: false,
    });

    // Create the user
    const adminUser = await User.create({
      username: "admin",
      privateNumber: "0000000",
      fullName: "admin user",
      password: hashedPassword,
      commandId: command.id, // Assign the command to the user
      editPerm: true,
      managePerm: true,
    });

    console.log("Admin user created successfully:", adminUser);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};
