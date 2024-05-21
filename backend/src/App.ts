import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import sequelize from "./dbConfig";
import usersRoutes from "./routes/usersRoutes";
import commandsRoutes from "./routes/commandRoutes";
import { handleError } from "./middlewares/errorHandler";
import { createAdminUser } from "./setup"; // Import the function

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/commands", commandsRoutes);

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});

// Start the server
const PORT = process.env.SERVER_PORT || 5001;
sequelize.sync().then(async () => {
  // comment the next row after the first run
  // await createAdminUser(); // Call the function to create the admin user
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
