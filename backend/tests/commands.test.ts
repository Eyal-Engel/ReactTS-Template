import { app, closeServer, startServer } from "../src/App"; // Adjust the import to your app location
import request from "supertest";

describe("Commands Routes", () => {
  afterAll(async () => {
    await closeServer();
  });

  let authToken = "";
  let newCommandId = "";
  const loginData = {
    privateNumber: "1234567",
    password: "Aa123456",
  };

  beforeAll(async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send(loginData);

    authToken = response.body.token;
  });

  it("should get all commands", async () => {
    const response = await request(app).get("/api/commands");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should create a new command", async () => {
    const newCommand = {
      commandName: "Test Command1",
      isNewSource: true,
    };

    const response = await request(app)
      .post("/api/commands")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newCommand);
    console.log("response.body");

    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("commandName", newCommand.commandName);
    newCommandId = response.body.id;
  });

  it("should update a command by ID", async () => {
    const updatedCommandData = {
      commandName: "Updated Command Name",
    };

    // Ensure newCommandId is defined before using it
    if (!newCommandId) {
      throw new Error("newCommandId is undefined");
    }

    const response = await request(app)
      .patch(`/api/commands/${newCommandId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedCommandData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", newCommandId);
    expect(response.body).toHaveProperty(
      "commandName",
      updatedCommandData.commandName
    );
  });

  it("should delete a command by ID", async () => {
    // Ensure newCommandId is defined before using it
    if (!newCommandId) {
      throw new Error("newCommandId is undefined");
    }

    const response = await request(app)
      .delete(`/api/commands/${newCommandId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(204);
  });
});
