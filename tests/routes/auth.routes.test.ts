import request from "supertest";

import { app } from "../../src/index";

describe("Auth routes", () => {
  test("Signup", async () => {
    const payload = { "username":"testeu458","firstname":"tes","lastname":"teur","email": "email_test@hotmail.com", "password": "123456" }
    await request(app).post("/api/auth/signup")
      .set('Content-type', 'application/json')
      .send(payload)
      .expect(200)

  });
});