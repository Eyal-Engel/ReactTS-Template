import { Model, DataTypes } from "sequelize";
import db from "../../dbconfig";

class User extends Model {
  public id!: string;
  public privateNumber!: string;
  public fullName!: string;
  public password!: string;
  public commandId!: string;
  public editPerm!: boolean;
  public managePerm!: boolean;
  public readonly commandName!: string; // Virtual field to represent the command name
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
      validate: {
        isNumeric: true,
        len: [7, 7],
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(?=.{2,30}$)[א-ת']+(\s[א-ת']{1,}){1,2}$/,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commandId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "commands",
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
