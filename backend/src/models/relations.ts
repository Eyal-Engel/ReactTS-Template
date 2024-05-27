import User from "./schemas/User";
import Command from "./schemas/Command";

export default function defineAssociations() {
  Command.hasMany(User, { foreignKey: "commandId", as: "commandUsers" });
  User.belongsTo(Command, { foreignKey: "commandId", as: "command" });
}
