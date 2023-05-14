import request from "supertest";
import { closeDatabase } from '../utils/db-handler'
import { app } from "../../src/index";
import { dataSpecies } from "../data/species.data";
import { createAccountWithBotanistRight } from "../../src/controllers/auth.controller";





let cookieJWTUser: string[]
let idUser: string
let cookieJWTBotanist: string[]
let idBotanist: string
let mySpeciesId: string[] = []
beforeAll(async () => {
    await createAccountWithBotanistRight()
    const respBotanist = await request(app).post("/api/auth/login")
        .set('Content-type', 'application/json')
        .send({ "email": "botanist@email.fr", "password": "123456" });
    idBotanist = respBotanist.body._id
    cookieJWTBotanist = respBotanist.get('Set-Cookie')

    const respUser = await request(app).post("/api/auth/signup")
        .set('Content-type', 'application/json')
        .send({ "username": "testjwt", "firstname": "tesjwt", "lastname": "teurff", "email": "jwttoken@hotmail.com", "password": "123456" });
    idUser = respUser.body._id
    cookieJWTUser = respUser.get('Set-Cookie')

    await dataSpecies.reduce(async (a, element) => {
        // Wait for the previous item to finish processing
        await a;
        // Process this item
        const resp = await request(app).post("/api/species")
            .set('Content-type', 'application/json')
            .set('Cookie', cookieJWTBotanist)
            .send({
                "name": element.name,
                "description": element.description,
                "sunExposure": element.sunExposure,
                "watering": element.watering,
                "optimalTemperature": element.optimalTemperature
            })
        mySpeciesId.push(resp.body._id)
    }, Promise.resolve());



})

afterAll(() => {
    closeDatabase()
}
);


describe("create  plants ", () => {

    test("create one plant  ", async () => {
        const resp = await request(app).post("/api/plant")
            .set('Content-type', 'application/json')
            .set('Cookie', cookieJWTUser)
            .send({
                "name": "Rosa",
                "speciesId": mySpeciesId[0],
            })
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual(expect.objectContaining({
            "name": "Rosa",
            "user": idUser,
            "species": mySpeciesId[0],
            "images": []
        }))

    });

    test("create one plant with no name  ", async () => {
        const resp = await request(app).post("/api/plant")
            .set('Content-type', 'application/json')
            .set('Cookie', cookieJWTUser)
            .send({
                "speciesId": mySpeciesId[0],
            })
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual(expect.objectContaining({
            "name": "Ma plante ( Ocimum diffusus )",
            "user": idUser,
            "species": mySpeciesId[0],

            "images": []
        }))

    });

    test("create one plant with botanist account   ", async () => {
        const resp = await request(app).post("/api/plant")
            .set('Content-type', 'application/json')
            .set('Cookie', cookieJWTBotanist)
            .send({
                "name": "Rosa botanist",
                "speciesId": mySpeciesId[0],
            })
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual(expect.objectContaining({
            "name": "Rosa botanist",
            "user": idBotanist,
            "species": mySpeciesId[0],

            "images": []
        }))

    });

    test("create one plant without auth", async () => {
        const resp = await request(app).post("/api/plant")
            .set('Content-type', 'application/json')
            .send({
                "name": "Rosa",
                "speciesId": mySpeciesId[0],
            })

        expect(resp.statusCode).toBe(404)
    });
})


describe("get plants  ", () => {
    let plantsUsersId: string[] = []
    beforeAll(async () => {
        await mySpeciesId.reduce(async (a, element) => {
            // Wait for the previous item to finish processing
            await a;
            // Process this item
            const resp = await request(app).post("/api/plant")
                .set('Content-type', 'application/json')
                .set('Cookie', cookieJWTUser)
                .send({
                    "speciesId": element,
                })
            plantsUsersId.push(resp.body._id)
        }, Promise.resolve());

    })
    
    test("get my plants ", async () => {
        const resp = await request(app).get("/api/plant")
            .set('Content-type', 'application/json')
            .set('Cookie', cookieJWTUser)

        expect(resp.statusCode).toBe(200)
        expect(resp.body.length).toEqual(5)
        expect(resp.body[0].name).toEqual("Ma plante ( Amelanchier nokoense )")
        expect(resp.body[1].name).toEqual("Ma plante ( Porteranthus ensata )")
        expect(resp.body[2].name).toEqual('Ma plante ( Dionaea crispum )')
        expect(resp.body[3].name).toEqual('Ma plante ( Nelumbo pumila )')
        expect(resp.body[4].name).toEqual('Ma plante ( Echium hemisphaerica )')
    });


    test("get some of my  plants without token  ", async () => {
  
        const resp = await request(app).get("/api/plant")
          .set('Content-type', 'application/json')
          expect(resp.statusCode).toBe(404)
          expect(resp.body).toMatchObject({ message: "Your are not logged in" })

      });

      test("get some of my plants withf one species ", async () => {
        const resp = await request(app).get("/api/plant")
          .set('Content-type', 'application/json')
          .send({"speciesId":mySpeciesId[3]})
          .set('Cookie', cookieJWTUser)
          
          expect(resp.statusCode).toBe(200)
          expect(resp.body.length).toEqual(1)
          expect(resp.body[0].name).toEqual("Ma plante ( Botrychium laevis )")

      });
  
      test("get some of my  plants with page ", async () => {
        const resp = await request(app).get("/api/plant")
          .set('Content-type', 'application/json')
          .send({"page":2})
          .set('Cookie', cookieJWTUser)
          
          expect(resp.statusCode).toBe(200)
          expect(resp.body.length).toEqual(5)
          expect(resp.body[0].name).toEqual("Ma plante ( Ruta calleryana )")
          expect(resp.body[1].name).toEqual('Ma plante ( Botrychium laevis )')
          expect(resp.body[2].name).toEqual('Ma plante ( Callistephus speciosa )')
          expect(resp.body[3].name).toEqual('Ma plante ( Paulownia vilarri )')
          expect(resp.body[4].name).toEqual('Ma plante ( Ocimum diffusus )')
      });
  
  
      test("get some of my   plants with order asc ", async () => {
    
        const resp = await request(app).get("/api/plant")
          .set('Content-type', 'application/json')
          .send({"order":"ASC"})
          .set('Cookie', cookieJWTUser)
          
          expect(resp.statusCode).toBe(200)
          expect(resp.body.length).toEqual(5)
          expect(resp.body[0].name).toEqual('Rosa')
          expect(resp.body[1].name).toEqual('Ma plante ( Ocimum diffusus )')
          expect(resp.body[2].name).toEqual('Ma plante ( Ocimum diffusus )')
          expect(resp.body[3].name).toEqual('Ma plante ( Paulownia vilarri )')
          expect(resp.body[4].name).toEqual('Ma plante ( Callistephus speciosa )')
      });
  
  
      test("get some of my plants with search ", async () => {
    
        const resp = await request(app).get("/api/plant")
          .set('Content-type', 'application/json')
          .send({"search":"chiu"})
          .set('Cookie', cookieJWTUser)
          expect(resp.statusCode).toBe(200)
          expect(resp.body.length).toEqual(2)
          expect(resp.body[0].name).toEqual("Ma plante ( Echium hemisphaerica )")
          expect(resp.body[1].name).toEqual("Ma plante ( Botrychium laevis )")
  
      });
  
  
      test("get one of my plant", async () => {
  
        const resp = await request(app).get("/api/plant/"+plantsUsersId[1])
          .set('Content-type', 'application/json')
          .set('Cookie', cookieJWTUser)
          console.log(resp.body,"okokokokokok")
          expect(resp.statusCode).toBe(200)
          expect(resp.body.name).toEqual("Ma plante ( Paulownia vilarri )")
    
      });
  
      test("get one plant with wrong jwt token", async () => {
  
        const resp = await request(app).get("/api/plant/"+plantsUsersId[0])
          .set('Content-type', 'application/json')
          .set('Cookie', cookieJWTBotanist)
          expect(resp.statusCode).toBe(404)
          expect(resp.body).toMatchObject({ message: "Your are not allowed" })
          
    
      });
  
      test("get one w-plant with wrong Id ", async () => {
  
        const resp = await request(app).get("/api/plant/534651")
          .set('Content-type', 'application/json')
          .set('Cookie', cookieJWTUser)
          expect(resp.statusCode).toBe(404)
    
      });


})