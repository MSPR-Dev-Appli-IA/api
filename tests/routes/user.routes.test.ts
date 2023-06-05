import request from "supertest";
import {loginWithUserRight} from "../data/accounts.data";

let userInfo: any

beforeAll(async () => {
  userInfo = await loginWithUserRight()
}, 15000);



describe("User Info", () => {

  test("Good Update User", async () => {
    const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/user")
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
      .send({"firstname": "tes_update", "lastname": "teur", "email": "john.doe@gmail.com", "password": "123456789"})
    expect(resp.statusCode).toBe(200)
  });

  test("Update user with field missing", async () => {
    const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/user")
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
      .send({ "tret": "test25_update"})
    expect(resp.statusCode).toBe(400)
  });


  test("Update user without token", async () => {
    const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/user")
      .set('Content-type', 'application/json')
      .send({ "firstname": "tes_update", "lastname": "teur", "email": "john.doe@gmail.com" })
    expect(resp.statusCode).toBe(401)

  });

  test("Update user password without constraint", async () => {
    const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/user")
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
      .send({ "password":"12345" })
    expect(resp.statusCode).toBe(400)
  });
});

describe("User Avatar", () => {

  test("Delete the image of a user who doesn't have one ", async () => {
    const resp = await request("https://api-arosaje-test.locascio.fr").delete("/api/user/avatar")
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
    expect(resp.statusCode).toBe(404)
    expect(resp.body.message).toEqual(["Image not found. Please Add image before."])
  });

  test("Add image to a user ", async () => {
    const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/user/avatar")
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
        .attach('file', `public/testImage/rosa.jpg`)
    expect(resp.statusCode).toBe(200)
    expect(resp.body.status).toEqual("success")
  });

  test("Delete image to a user ", async () => {
    const resp = await request("https://api-arosaje-test.locascio.fr").delete("/api/user/avatar")
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
    expect(resp.statusCode).toBe(200)
    expect(resp.body.message).toEqual("File deleted")
  });
});



