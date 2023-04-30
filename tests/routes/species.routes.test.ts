import request from "supertest";
import { closeDatabase } from '../utils/db-handler'
import { app } from "../../src/index";
import { createAccountWithBotanistRight } from "../../src/controllers/auth.controller";

let cookieJWTBotanist: string[]
let cookieJWTUser: string[]
beforeAll(async () => {
    console.log("le before alll des species ")
    await createAccountWithBotanistRight()
    const respBotanist = await request(app).post("/api/auth/login")
        .set('Content-type', 'application/json')
        .send({ "email": "botanist@email.fr", "password": "123456" });
    cookieJWTBotanist = respBotanist.get('Set-Cookie')

    const respUser = await request(app).post("/api/auth/signup")
        .set('Content-type', 'application/json')
        .send({ "username": "testjwt", "firstname": "tesjwt", "lastname": "teurff", "email": "jwttoken@hotmail.com", "password": "123456" });
    cookieJWTUser = respUser.get('Set-Cookie')
});


afterAll(async () => {
    console.log("le closse alll des species ")
    closeDatabase()
}
);

describe("create species", () => {

    test("create species without image ", async () => {
  
      const resp = await request(app).post("/api/species")
        .set('Content-type', 'application/json')
        .set('Cookie', cookieJWTBotanist)
        .send({ "name":"rosa",
        "description":"Voila ma deszcription",
        "sunExposure":"A lombre en vrai",
        "watering":"l'eau dans 20 30 ans yen aura plus",
        "optimalTemperature":"50"
     })
      expect(resp.statusCode).toBe(200)
      expect(resp.body).toEqual(expect.objectContaining({ "name":"rosa",
      "description":"Voila ma deszcription",
      "sunExposure":"A lombre en vrai",
      "watering":"l'eau dans 20 30 ans yen aura plus",
      "optimalTemperature":"50",
      "images":[]
   }))
    });

    test("create species without botanist account ", async () => {
  
        const resp = await request(app).post("/api/species")
          .set('Content-type', 'application/json')
          .set('Cookie', cookieJWTUser)
          .send({ "name":"rosa",
          "description":"Voila ma deszcription",
          "sunExposure":"A lombre en vrai",
          "watering":"l'eau dans 20 30 ans yen aura plus",
          "optimalTemperature":"50"
       })
       expect(resp.statusCode).toBe(404)
       expect(resp.body).toMatchObject( { message: "Your are not allowed" })
      });


  });
  