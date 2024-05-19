import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import usersRoutes from "./routes/usersRoutes";
import commandsRoutes from "./routes/commandsRoutes";

import db from "./dbconfig";
import "./models/relations";
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from './swagger.json';
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config();

const app = express();

// Security middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World From Mekalar!");
});

app.use("/api/users", usersRoutes);
app.use("/api/commands", commandsRoutes);
// app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  // This function will execute if any middleware in front of it yields an error
  if (res.headersSent) {
    // Check if the response has already been sent
    return next(error);
  }

  // If the error code property is set or default to 500 => error code that something went wrong
  console.log(error);

  return res.status(error.code || 500).json({
    body: error || "An unknown error occurred!",
  });
});

// Start the server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await db.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    // Sync all models
    await db.sync({ force: false });

    console.log("All models synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
