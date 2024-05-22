// still need to work on tests!

import request from "supertest";
import app from "../src/App"; // Adjust the path to your app

describe("Commands API", () => {
  let commandId: string;
  const userId = "user-id-1"; // Replace with a valid user ID in your database

  // Test for getting all commands
  it("should fetch all commands", async () => {
    const response = await request(app).get("/commands");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Test for creating a new command
  it("should create a new command", async () => {
    const response = await request(app).post("/commands").send({
      commandName: "Test Command",
      userId: userId,
      isNewSource: true,
    });
    expect(response.status).toBe(201);
    expect(response.body.newCommand).toHaveProperty("id");
    commandId = response.body.newCommand.id; // Save the command ID for later tests
  });

  // Test for getting a specific command by ID
  it("should fetch a command by ID", async () => {
    const response = await request(app).get(`/commands/${commandId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", commandId);
  });

  // Test for updating a command by ID
  it("should update a command by ID", async () => {
    const response = await request(app).patch(`/commands/${commandId}`).send({
      commandName: "Updated Test Command",
      userId: userId,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("commandName", "Updated Test Command");
  });

  // Test for deleting a command by ID
  it("should delete a command by ID", async () => {
    const response = await request(app)
      .delete(`/commands/${commandId}`)
      .send({ userId: userId });
    expect(response.status).toBe(204);
  });
});
