import request from "supertest";
import { closeDatabase } from '../utils/db-handler'
import { extractCookies } from "../utils/extract-cookie";
import { app } from "../../src/index";

let cookieJWT: string[]
beforeAll(async () => {
  const resp = await request(app).post("/api/auth/signup")
    .set('Content-type', 'application/json')
    .send({ "username": "testjwt", "firstname": "tesjwt", "lastname": "teurff", "email": "jwttoken@hotmail.com", "password": "123456" });
  cookieJWT = resp.get('Set-Cookie')
}, 15000);


afterAll(async () => {
  await closeDatabase()
}
);

describe("Signup", () => {

  test("Good Signup", async () => {

    const resp = await request(app).post("/api/auth/signup")
      .set('Content-type', 'application/json')
      .send({ "username": "testeu458", "firstname": "tes", "lastname": "teur", "email": "email_test@hotmail.com", "password": "123456" })
    expect(resp.statusCode).toBe(200)
    expect(resp.body.local).toEqual(expect.objectContaining({ 'email': "email_test@hotmail.com", "password": null }))
    expect(resp.body).toEqual(expect.objectContaining({ "username": "testeu458", "firstname": "tes", "lastname": "teur" }))
  });

  test("Good Signup while being connected", async () => {

    const resp = await request(app).post("/api/auth/signup")
      .set('Content-type', 'application/json')
      .set('Cookie', cookieJWT)
      .send({ "username": "test25", "firstname": "tes", "lastname": "teur", "email": "email_test25@hotmail.com", "password": "123456" })
    expect(resp.statusCode).toBe(404)
    expect(resp.body).toMatchObject({ message: "Your are  logged in" })
  });

  test("Signup with wrong  password ", async () => {
    const payload = { "username": "testeu458sf", "firstname": "tes", "lastname": "teur", "email": "email_test147@hotmail.com", "password": "12345" }
    const resp = await request(app).post("/api/auth/signup")
      .set('Content-type', 'application/json')
      .send(payload)
    expect(resp.statusCode).toBe(404)
    expect(resp.body).toMatchObject([{
      "field": "password",
      "message": "Le mot de passe doit être au minimum de 6 caractères"
    }])
  });

  test("Signup whith doublon for the email", async () => {

    const resp = await request(app).post("/api/auth/signup")
      .set('Content-type', 'application/json')
      .send({ "username": "testeu458", "firstname": "tes", "lastname": "teur", "email": "email_test@hotmail.com", "password": "123456" })
    expect(resp.statusCode).toBe(404)
  });
});


describe("Login", () => {

  test("login", async () => {
    const resp = await request(app).post("/api/auth/login")
      .send({ "email": "jwttoken@hotmail.com", "password": "123456" })
    expect(resp.statusCode).toBe(200)
    expect(resp.body.local).toEqual(expect.objectContaining({ 'email': "jwttoken@hotmail.com", "password": null }))
    expect(resp.body).toEqual(expect.objectContaining({ "username": "testjwt", "firstname": "tesjwt", "lastname": "teurff" }))
  });
  test("login while being already connected ", async () => {
    const resp = await request(app).post("/api/auth/login")
      .set('Cookie', cookieJWT)
      .send({ "email": "jwttoken@hotmail.com", "password": "123456" })
    expect(resp.statusCode).toBe(404)
    expect(resp.body).toMatchObject({ message: "Your are  logged in" })
  });

  test("login wrong password ", async () => {
    const resp = await request(app).post("/api/auth/login")
      .send({ "email": "jwttoken@hotmail.com", "password": "1234s56" })
    expect(resp.statusCode).toBe(404)
    expect(resp.body).toMatchObject([{
      "field": "password",
      "message": "Mauvais identifiants"
    }])
  });

});

describe("logout", () => {


  test("logout ", async () => {
    const resp = await request(app).get("/api/auth/logout")
      .set('Cookie', cookieJWT)
      .send()
    expect(resp.statusCode).toBe(200)
    expect(extractCookies(resp.headers).jwt.value).toEqual("")
  });
  test("logout without being connected  ", async () => {
    const resp = await request(app).get("/api/auth/logout")
      .send()
    expect(resp.statusCode).toBe(404)
    expect(resp.body).toMatchObject({ message: "Your are not logged in" })
  });

});


describe("me", () => {

  test("me with valid jwt token", async () => {
    const resp = await request(app).get("/api/auth/me")
      .set('Cookie', cookieJWT)
      .send()
    expect(resp.statusCode).toBe(200)
    expect(resp.body.local).toEqual(expect.objectContaining({ 'email': "jwttoken@hotmail.com", "password": null }))
    expect(resp.body).toEqual(expect.objectContaining({ "username": "testjwt", "firstname": "tesjwt", "lastname": "teurff" }))
  });
  test("me without valid jwt token", async () => {
    const resp = await request(app).get("/api/auth/me")
      .send()
    expect(resp.statusCode).toBe(200)
    expect(resp.body).toEqual(null)
  });


});

