import request from "supertest";
import { closeDatabase } from '../utils/db-handler'
import { app } from "../../src/index";
import { createAccountWithBotanistRight } from "../../src/controllers/auth.controller";

let cookieJWTBotanist: string[]
// let cookieJWTUser: string[]
beforeAll(async () => {
    await createAccountWithBotanistRight()
    const respBotanist = await request(app).post("/api/auth/login")
        .set('Content-type', 'application/json')
        .send({ "email": "botanist@email.fr", "password": "123456" });
    cookieJWTBotanist = respBotanist.get('Set-Cookie')

    // const respUser = await request(app).post("/api/auth/signup")
    //     .set('Content-type', 'application/json')
    //     .send({ "username": "testjwt", "firstname": "tesjwt", "lastname": "teurff", "email": "jwttoken@hotmail.com", "password": "123456" });
    // cookieJWTUser = respUser.get('Set-Cookie')
});


afterAll(async () => {
    closeDatabase()
}
);

describe("create species", () => {

    test("create speices without image and without general advices", async () => {
  
      const resp = await request(app).post("/api/species")
        .set('Content-type', 'application/json')
        .set('Cookie', cookieJWTBotanist)
        .send({ "name":"rosa","generalAdvices":[] })
      expect(resp.statusCode).toBe(200)
      expect(resp.body).toEqual(expect.objectContaining({ "name":"rosa" ,"generalAdvices":[],"images":[]}))
    });

    test("create speices without image", async () => {
  
        const resp = await request(app).post("/api/species")
          .set('Content-type', 'application/json')
          .set('Cookie', cookieJWTBotanist)
          .send({ "name":"rosa","generalAdvices":[{"descrfiption"}] })
      console.log(resp.body,"voila mon body ")
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual(expect.objectContaining({ "name":"rosa" ,"generalAdvices":[],"images":[]}))
      });

  });
  