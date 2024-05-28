import { app, closeServer, startServer } from "../src/App"; // Adjust the import to your app location
import request from "supertest";

describe("Commands Routes", () => {
  beforeAll(async () => {
    await startServer(); // Ensure the server is started before running tests
  });

  afterAll(async () => {
    await closeServer(); // Close the server after all tests are done
  });

  let authToken = "";
  let newCommandId = "";
  const loginData = {
    privateNumber: "0000000",
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

  it("should get a command by ID", async () => {
    const response = await request(app).get(
      `/api/commands/9e874ec5-101c-4ae1-9d80-23ea226c1e97`
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("isNewSource");
  });

  it("should create a new command", async () => {
    const newCommand = {
      name: "Test Command1",
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
    expect(response.body).toHaveProperty("name", newCommand.name);
    newCommandId = response.body.id;
  });

  it("should update a command by ID", async () => {
    const updatedCommandData = {
      name: "Updated Command Name",
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
    expect(response.body).toHaveProperty("name", updatedCommandData.name);
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
