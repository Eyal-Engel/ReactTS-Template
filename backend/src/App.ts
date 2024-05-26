import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

import usersRoutes from "./routes/usersRoutes";
import commandsRoutes from "./routes/commandRoutes";
import { handleError } from "./middlewares/errorHandler";
import { createAdminUser } from "./setup";
import cors from "cors";
import db from "./dbconfig";

dotenv.config();

const app: Application = express();

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
db.sync().then(async () => {
  await createAdminUser();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
