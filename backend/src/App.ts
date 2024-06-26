import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import usersRoutes from "./routes/usersRoutes";
import commandsRoutes from "./routes/commandRoutes";
import { handleError } from "./middlewares/errorHandler";
import { createAdminUser } from "./setup";
import cors from "cors";
import db from "./dbconfig";
import defineAssociations from "./models/relations"; // Import the function to define associations

dotenv.config();

const app: Application = express();
let server: any;

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/commands", commandsRoutes);

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});

// Start the server
const PORT = process.env.SERVER_PORT || 5001;
const startServer = async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");

    // Call the function to define associations
    defineAssociations();

    // Sync all models
    await db.sync();

    // Create admin user
    // await createAdminUser();

    // Start the server
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Close the server
const closeServer = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
    });
  }
};

if (require.main === module) {
  startServer();
}

export { app, startServer, closeServer };
