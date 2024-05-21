import { Dialect, Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DB_NAME);
console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOST);
console.log(process.env.DB_DIALECT);
console.log(process.env.DB_PORT);

const DB_NAME = process.env.DB_NAME as string;
const DB_USERNAME = process.env.DB_USERNAME as string;
const DB_PASSWORD = process.env.DB_PASSWORD as string;
const DB_HOST = process.env.DB_HOST as string;
const DB_DIALECT = process.env.DB_DIALECT as Dialect;
const DB_PORT = process.env.DB_PORT as string;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: DB_DIALECT,
  host: DB_HOST,
  port: parseInt(DB_PORT),
});

export default sequelize;
