import { Model, DataTypes } from "sequelize";
import db from "../../dbconfig";

class Command extends Model {
  public id!: string;
  public name!: string;
  public isNewSource!: boolean;
}

Command.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isNewSource: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: db,
    modelName: "commands",
    timestamps: false,
    createdAt: true,
  }
);

export default Command;
