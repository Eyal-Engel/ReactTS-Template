import { Model, DataTypes } from "sequelize";

import Command from "./Command"; // Import the Command model
import db from "../../dbconfig";

class User extends Model {
  public id!: string;
  public privateNumber!: string;
  public fullName!: string;
  public password!: string;
  public commandId!: string;
  public editPerm!: boolean;
  public managePerm!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    privateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commandId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Command,
        key: "id",
      },
    },
    editPerm: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    managePerm: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: "users",
    timestamps: false,
    createdAt: true,
  }
);

export default User;
