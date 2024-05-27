import request from "supertest";
import { app, closeServer, startServer } from "../src/App"; // Adjust the import to your app location

describe("User Routes", () => {
  afterAll(async () => {
    await closeServer();
  });
  let userId = "";
  let authToken = "";
  const newPasswordData = {
    newPassword: "NewPassword123",
  };

  beforeAll(async () => {
    const loginData = {
      privateNumber: "1234567",
      password: "Aa123456",
    };
    const response = await request(app)
      .post("/api/users/login")
      .send(loginData);

    authToken = response.body.token;
    userId = response.body.userId;
  });

  it("should get all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
  });

  it("should get a user by ID", async () => {
    const response = await request(app).get(
      `/api/users/85bdabba-2e51-4406-a1e6-70f142b27d15`
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("privateNumber");
    expect(response.body).toHaveProperty("fullName");
    expect(response.body).toHaveProperty("password");
    expect(response.body).toHaveProperty("commandId");
    expect(response.body).toHaveProperty("editPerm");
    expect(response.body).toHaveProperty("managePerm");
  });

  it("should create a new user", async () => {
    const userData = {
      privateNumber: "1234566",
      fullName: "Israel Israeli",
      password: "Aa123456",
      commandId: "38dd4929-d496-4df7-824d-3fa01a640ca3",
      editPerm: true,
      managePerm: false,
    };
    const response = await request(app)
      .post("/api/users/signup")
      .set("Authorization", `Bearer ${authToken}`)
      .send(userData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("privateNumber");
    expect(response.body).toHaveProperty("fullName");
    expect(response.body).toHaveProperty("password");
    expect(response.body).toHaveProperty("commandId");
    expect(response.body).toHaveProperty("editPerm");
    expect(response.body).toHaveProperty("managePerm");
    userId = response.body.id;
  });

  it("should update a user", async () => {
    const updatedUserData = {
      username: "new username",
    };
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedUserData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("privateNumber");
    expect(response.body).toHaveProperty("fullName");
    expect(response.body).toHaveProperty("password");
    expect(response.body).toHaveProperty("commandId");
    expect(response.body).toHaveProperty("editPerm");
    expect(response.body).toHaveProperty("managePerm");
  });

  it("should change a user's password", async () => {
    const response = await request(app)
      .patch(`/api/users/password/${userId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(newPasswordData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("privateNumber");
    expect(response.body).toHaveProperty("fullName");
    expect(response.body).toHaveProperty("password");
    expect(response.body).toHaveProperty("commandId");
    expect(response.body).toHaveProperty("editPerm");
    expect(response.body).toHaveProperty("managePerm");
  });

  it("should login the user", async () => {
    const updatedLoginData = {
      privateNumber: "1234566",
      password: newPasswordData.newPassword,
    };
    const response = await request(app)
      .post("/api/users/login")
      .send(updatedLoginData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("privateNumber");
    expect(response.body).toHaveProperty("token");
  });

  it("should delete a user", async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });
});
