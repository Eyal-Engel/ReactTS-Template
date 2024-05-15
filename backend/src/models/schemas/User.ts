import { Model, DataTypes } from "sequelize";
import db from "../../dbconfig";
import Command from "./Command"; // Import the Command model

interface UserAttributes {
  id: string;
  privateNumber: string;
  fullName: string;
  password: string;
  commandId: string;
  editPerm: boolean;
  managePerm: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
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
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    privateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // Your validation regex here
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    editPerm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    managePerm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    // Define the foreign key constraint for the commandId
    commandId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Command, // Referencing the Command model
        key: "id",
      },
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
