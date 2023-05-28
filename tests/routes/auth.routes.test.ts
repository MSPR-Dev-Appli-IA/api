import request from "supertest";

let userToken: any
describe("Signup", () => {

  test("Good Signup", async () => {

    const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/auth/register")
      .set('Content-type', 'application/json')
      .send({ "username": "testeu458", "firstname": "tes", "lastname": "teur", "email": "email_test@hotmail.com", "password": "123456" })
    expect(resp.statusCode).toBe(200)
    expect(resp.body).toEqual({status: "success", message: "User created."})
  });

  test("Signup with wrong  password ", async () => {
    const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/auth/register")
        .set('Content-type', 'application/json')
        .send({ "username": "testeu458sf", "firstname": "tes", "lastname": "teur", "email": "email_test147@hotmail.com", "password": "12345" })
    expect(resp.statusCode).toBe(400)
    expect(resp.body).toMatchObject({
      "field": ["password"],
      "message": ["Le mot de passe doit être au minimum de 6 caractères"]
    })
  });
});

describe("Logged Signup", () => {

  beforeAll(async () => {

    const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/auth/login")
        .set('Content-type', 'application/json')
        .send({"email": "email_test@hotmail.com", "password": "123456"});
    userToken = resp.body.jwt
  }, 15000);

  test("Good Signup while being connected", async () => {

    const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/auth/register")
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + userToken)
        .send({ "username": "test25", "firstname": "tes", "lastname": "teur", "email": "email_test25@hotmail.com", "password": "123456" })
    expect(resp.statusCode).toBe(304)
  });

})


// describe("Login", () => {
//
//   test("login", async () => {
//     const resp = await request(app).post("/api/auth/login")
//       .send({ "email": "jwttoken@hotmail.com", "password": "123456" })
//     expect(resp.statusCode).toBe(200)
//     expect(resp.body.local).toEqual(expect.objectContaining({ 'email': "jwttoken@hotmail.com", "password": null }))
//     expect(resp.body).toEqual(expect.objectContaining({ "username": "testjwt", "firstname": "tesjwt", "lastname": "teurff" }))
//   });
//   test("login while being already connected ", async () => {
//     const resp = await request(app).post("/api/auth/login")
//       .set('Cookie', cookieJWT)
//       .send({ "email": "jwttoken@hotmail.com", "password": "123456" })
//     expect(resp.statusCode).toBe(404)
//     expect(resp.body).toMatchObject({ message: "Your are  logged in" })
//   });
//
//   test("login wrong password ", async () => {
//     const resp = await request(app).post("/api/auth/login")
//       .send({ "email": "jwttoken@hotmail.com", "password": "1234s56" })
//     expect(resp.statusCode).toBe(404)
//     expect(resp.body).toMatchObject([{
//       "field": "password",
//       "message": "Mauvais identifiants"
//     }])
//   });
//
// });
//
// describe("logout", () => {
//
//
//   test("logout ", async () => {
//     const resp = await request(app).get("/api/auth/logout")
//       .set('Cookie', cookieJWT)
//       .send()
//     expect(resp.statusCode).toBe(200)
//     expect(extractCookies(resp.headers).jwt.value).toEqual("")
//   });
//   test("logout without being connected  ", async () => {
//     const resp = await request(app).get("/api/auth/logout")
//       .send()
//     expect(resp.statusCode).toBe(404)
//     expect(resp.body).toMatchObject({ message: "Your are not logged in" })
//   });
//
// });
//
//
// describe("me", () => {
//
//   test("me with valid jwt token", async () => {
//     const resp = await request(app).get("/api/auth/me")
//       .set('Cookie', cookieJWT)
//       .send()
//     expect(resp.statusCode).toBe(200)
//     expect(resp.body.local).toEqual(expect.objectContaining({ 'email': "jwttoken@hotmail.com", "password": null }))
//     expect(resp.body).toEqual(expect.objectContaining({ "username": "testjwt", "firstname": "tesjwt", "lastname": "teurff" }))
//   });
//   test("me without valid jwt token", async () => {
//     const resp = await request(app).get("/api/auth/me")
//       .send()
//     expect(resp.statusCode).toBe(200)
//     expect(resp.body).toEqual(null)
//   });
//
//
// });

