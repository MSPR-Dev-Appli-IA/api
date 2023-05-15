import request from "supertest";
import { closeDatabase } from '../utils/db-handler'
import { app } from "../../src/index";
import * as fs from 'fs';
import { IImage } from "../../src/interfaces";

let cookieJWT: string[]

beforeAll(async () => {

  const resp = await request(app).post("/api/auth/signup")
    .set('Content-type', 'application/json')
    .send({ "username": "testjwt", "firstname": "tesjwt", "lastname": "teurff", "email": "jwttoken@hotmail.com", "password": "123456" });
  cookieJWT = resp.get('Set-Cookie')
}, 15000);


afterAll(async () => {

  await closeDatabase()
});


describe("udpate", () => {

  test("update some info", async () => {
    const resp = await request(app).post("/api/user/update")
      .set('Content-type', 'application/json')
      .set('Cookie', cookieJWT)
      .send({ "username": "test25_update", "firstname": "tes_update", "lastname": "teur" })
    expect(resp.statusCode).toBe(200)
    expect(resp.body).toMatchObject({  "username": "test25_update", "firstname": "tes_update", "lastname": "teur"  })
  });

  test("update some info field missing", async () => {
    const resp = await request(app).post("/api/user/update")
      .set('Content-type', 'application/json')
      .set('Cookie', cookieJWT)
      .send({ "username": "test25_update", "lastname": "teur" })
    expect(resp.statusCode).toBe(404)
  });


  test("update without token", async () => {
    const resp = await request(app).post("/api/user/update")
      .set('Content-type', 'application/json')
      .send({ "username": "test25_update", "firstname": "tes_update", "lastname": "teur" })
    expect(resp.statusCode).toBe(404)
 
  });


  test("update password", async () => {
    const resp = await request(app).post("/api/user/updatePassword")
      .set('Content-type', 'application/json')
      .set('Cookie', cookieJWT)
      .send({ "password":"1234567" })
    expect(resp.statusCode).toBe(200)
    const respLogin = await request(app).post("/api/auth/login")
    .send({ "email": "jwttoken@hotmail.com", "password": "1234567" })
    expect(respLogin.statusCode).toBe(200)
  });

  test("update password without contraint", async () => {
    const resp = await request(app).post("/api/user/updatePassword")
      .set('Content-type', 'application/json')
      .set('Cookie', cookieJWT)
      .send({ "password":"12345" })
    expect(resp.statusCode).toBe(404)
  });

  test("update password withoutaccount", async () => {
    const resp = await request(app).post("/api/user/updatePassword")
      .set('Content-type', 'application/json')
      .send({ "password":"1234567" })
    expect(resp.statusCode).toBe(404)
  });

  let imagesAvatar : IImage[] = []
  test("update avatar", async () => {
    const resp = await request(app).post("/api/user/updateAvatar")
      .set('Content-Type','multipart/form-data')
      .set('Cookie', cookieJWT)
      .attach('file', `public/testImage/rosa.jpg`) 
    expect(resp.statusCode).toBe(200)
    expect(fs.existsSync("public/image/" + resp.body.image.path)).toBeTruthy()
    imagesAvatar.push(resp.body.image)
  });

  test("update avatar", async () => {
    const resp = await request(app).post("/api/user/updateAvatar")
      .set('Content-Type','multipart/form-data')
      .set('Cookie', cookieJWT)
      .attach('file', `public/testImage/rosa.jpg`) 
    console.log(resp.body)
    expect(resp.statusCode).toBe(200)
    expect(fs.existsSync("public/image/" + resp.body.image.path)).toBeTruthy()
    expect(fs.existsSync("public/image/" + imagesAvatar[0].path)).toBeFalsy()
    imagesAvatar.push(resp.body.image)
    
  });

  test("delete avatar", async () => {
    const resp = await request(app).delete("/api/user/deleteAvatar")
      .set('Content-type', 'application/json')
      .set('Cookie', cookieJWT)
    expect(resp.statusCode).toBe(200)
    expect(fs.existsSync("public/image/" + imagesAvatar[1].path)).toBeFalsy()
  });


  test("update avatar without account", async () => {
    const resp = await request(app).post("/api/user/updateAvatar")
    .set('Content-Type','multipart/form-data')
    .attach('file', `public/testImage/rosa.jpg`) 
    expect(resp.statusCode).toBe(404)
  });

  



});



