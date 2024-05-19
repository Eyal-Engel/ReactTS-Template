import { DataTypes } from "sequelize";
import User from "./schemas/User";
import Command from "./schemas/Command";

// One-to-many relation (command has many users)
Command.hasMany(User, {
  foreignKey: {
    name: "commandId", // Name of the foreign key in the User model
    allowNull: false,
  },
});
User.belongsTo(Command, {
  foreignKey: "commandId", // Define the foreign key in the User model
});
