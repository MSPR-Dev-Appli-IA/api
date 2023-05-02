import request from "supertest";
import { closeDatabase } from '../utils/db-handler'
import { app } from "../../src/index";
import { createAccountWithBotanistRight } from "../../src/controllers/auth.controller";
import { dataSpecies } from "../data/species.data";






let cookieJWTBotanist: string[]
let cookieJWTUser: string[]
beforeAll(async () => {
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
    closeDatabase()
}
);

describe("create species", () => {
    test("create species ", async () => {
  
      const resp = await request(app).post("/api/species")
        .set('Content-type', 'application/json')
        .set('Cookie', cookieJWTBotanist)
        .send({ "name":"Rosa",
        "description":"Voila ma deszcription",
        "sunExposure":"A lombre en vrai",
        "watering":"l'eau dans 20 30 ans yen aura plus",
        "optimalTemperature":"50"
     })
      expect(resp.statusCode).toBe(200)
      expect(resp.body).toEqual(expect.objectContaining({ "name":"Rosa",
      "description":"Voila ma deszcription",
      "sunExposure":"A lombre en vrai",
      "watering":"l'eau dans 20 30 ans yen aura plus",
      "optimalTemperature":"50",
      "images":[]
   }))
    });

    test("create species with the same name ", async () => {
  
        const resp = await request(app).post("/api/species")
          .set('Content-type', 'application/json')
          .set('Cookie', cookieJWTBotanist)
          .send({ "name":"Rosa",
          "description":"Voila ma deszcription",
          "sunExposure":"A lombre en vrai",
          "watering":"l'eau dans 20 30 ans yen aura plus",
          "optimalTemperature":"50"
       })
        expect(resp.statusCode).toBe(404)
      
      });

    test("create species without botanist account ", async () => {
  
        const resp = await request(app).post("/api/species")
          .set('Content-type', 'application/json')
          .set('Cookie', cookieJWTUser)
          .send({ "name":"rosa78",
          "description":"Voila ma deszcription",
          "sunExposure":"A lombre en vrai",
          "watering":"l'eau dans 20 30 ans yen aura plus",
          "optimalTemperature":"50"
       })
       expect(resp.statusCode).toBe(404)
       expect(resp.body).toMatchObject( { message: "Your are not allowed" })
      });


  });
  

  describe("get species", () => {
    let speciesIdToGet:String|null = null
    beforeAll(async()=>{
      dataSpecies.forEach(async(element,index) => {
       const resp = await request(app).post("/api/species")
        .set('Content-type', 'application/json')
        .set('Cookie', cookieJWTBotanist)
        .send({ "name":element.name,
        "description":element.description,
        "sunExposure":element.sunExposure,
        "watering":element.watering,
        "optimalTemperature":element.optimalTemperature
     })
     if (index==0){
      speciesIdToGet = resp.body._id
     }

      });
    })

    test("get some species ", async () => {
  
      const resp = await request(app).get("/api/species")
        .set('Content-type', 'application/json')
        .set('Cookie', cookieJWTUser)
        expect(resp.statusCode).toBe(200)
        expect(resp.body.length).toEqual(5)
        expect(resp.body[0].name).toEqual("Ruta calleryana")
        expect(resp.body[1].name).toEqual("Rosa")
        expect(resp.body[2].name).toEqual('Porteranthus ensata')
        expect(resp.body[3].name).toEqual('Paulownia vilarri')
        expect(resp.body[4].name).toEqual('Ocimum diffusus')
    });


    test("get some species without token  ", async () => {
  
      const resp = await request(app).get("/api/species")
        .set('Content-type', 'application/json')
        expect(resp.statusCode).toBe(404)
        expect(resp.body).toMatchObject({ message: "Your are not logged in" })

    });

    test("get some species with page ", async () => {
  
      const resp = await request(app).get("/api/species")
        .set('Content-type', 'application/json')
        .send({"page":2})
        .set('Cookie', cookieJWTUser)
        expect(resp.statusCode).toBe(200)
        expect(resp.body.length).toEqual(5)
        expect(resp.body[0].name).toEqual("Nelumbo pumila")
        expect(resp.body[1].name).toEqual('Echium hemisphaerica')
        expect(resp.body[2].name).toEqual('Dionaea crispum')
        expect(resp.body[3].name).toEqual('Callistephus speciosa')
        expect(resp.body[4].name).toEqual('Botrychium laevis')
    });


    test("get some species with order asc ", async () => {
  
      const resp = await request(app).get("/api/species")
        .set('Content-type', 'application/json')
        .send({"order":"ASC"})
        .set('Cookie', cookieJWTUser)
        expect(resp.statusCode).toBe(200)
        expect(resp.body.length).toEqual(5)
        expect(resp.body[0].name).toEqual("Amelanchier nokoense")
        expect(resp.body[1].name).toEqual('Botrychium laevis')
        expect(resp.body[2].name).toEqual('Callistephus speciosa')
        expect(resp.body[3].name).toEqual('Dionaea crispum')
        expect(resp.body[4].name).toEqual('Echium hemisphaerica')


    });


    test("get some species with search ", async () => {
  
      const resp = await request(app).get("/api/species")
        .set('Content-type', 'application/json')
        .send({"search":"la"})
        .set('Cookie', cookieJWTUser)
        expect(resp.statusCode).toBe(200)
        expect(resp.body.length).toEqual(4)
        expect(resp.body[0].name).toEqual("Paulownia vilarri")
        expect(resp.body[1].name).toEqual("Nelumbo pumila")
        expect(resp.body[2].name).toEqual("Botrychium laevis")
        expect(resp.body[3].name).toEqual("Amelanchier nokoense")

    });


    test("get one species", async () => {

      const resp = await request(app).get("/api/species/"+speciesIdToGet)
        .set('Content-type', 'application/json')
        .set('Cookie', cookieJWTUser)

        expect(resp.statusCode).toBe(200)
        expect(resp.body.name).toEqual("Ocimum diffusus")
  
    });

    test("get one species without jwt token", async () => {

      const resp = await request(app).get("/api/species/"+speciesIdToGet)
        .set('Content-type', 'application/json')
        expect(resp.statusCode).toBe(404)

  
    });

    test("get one species with wrong Id ", async () => {

      const resp = await request(app).get("/api/species/534651")
        .set('Content-type', 'application/json')
        .set('Cookie', cookieJWTUser)
        expect(resp.statusCode).toBe(404)
  
    });

  });
  