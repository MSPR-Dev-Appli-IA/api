import request from "supertest";
import { closeDatabase } from '../utils/db-handler'
import { app } from "../../src/index";
import { dataSpecies } from "../data/species.data";
import { createAccountWithBotanistRight } from "../../src/controllers/auth.controller";
import * as fs from 'fs';
import { IImage } from "../../src/interfaces";




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


describe("plants and image ", () => {
    let plantIdToGet:String|null = null
    let arrayPathImage:IImage[]= []
    beforeAll(async()=>{
     
       const resp = await request(app).post("/api/plant")
        .set('Content-type', 'application/json')
        .set('Cookie', cookieJWTUser)
        .send({ 
        "speciesId": mySpeciesId[0],
     })
     
     plantIdToGet = resp.body._id
     
     
      });


      test("add image to a plant ", async () => {

        const resp = await request(app).post("/api/plant/addImage/"+plantIdToGet)
          .set('Content-Type','multipart/form-data')
          .set('Cookie', cookieJWTUser)
          .attach('file', `public/testImage/rosa.jpg`) 
          expect(resp.statusCode).toBe(200)
          expect(resp.body.name).toEqual("Ma plante ( Ocimum diffusus )")
          expect(resp.body.images.length).toEqual(1)
          expect(fs.existsSync("public/image/" + resp.body.images[0].path)).toBeTruthy()
          arrayPathImage.push(resp.body.images[0])
      });

      test("add image to a plant with wrong  botanist account ", async () => {
        const resp = await request(app).post("/api/plant/addImage/"+plantIdToGet)
          .set('Content-Type','multipart/form-data')
          .set('Cookie', cookieJWTBotanist)
          .attach('file', `public/testImage/rosa.jpg`) 
          expect(resp.statusCode).toBe(404)

      });



      test("add another image to a plant ", async () => {
        const resp = await request(app).post("/api/plant/addImage/"+plantIdToGet)
          .set('Content-Type','multipart/form-data')
          .set('Cookie', cookieJWTUser)
          .attach('file', `public/testImage/rosa.jpg`) 
          expect(resp.statusCode).toBe(200)
          expect(resp.body.name).toEqual("Ma plante ( Ocimum diffusus )")
          expect(resp.body.images.length).toEqual(2)
          expect(fs.existsSync("public/image/" + resp.body.images[1].path)).toBeTruthy()
          arrayPathImage.push(resp.body.images[1])
      });

      test("add another image to a plant ", async () => {
        const resp = await request(app).post("/api/plant/addImage/"+plantIdToGet)
          .set('Content-Type','multipart/form-data')
          .set('Cookie', cookieJWTUser)
          .attach('file', `public/testImage/rosa.jpg`) 
          expect(resp.statusCode).toBe(200)
          expect(resp.body.name).toEqual("Ma plante ( Ocimum diffusus )")
          expect(resp.body.images.length).toEqual(3)
          expect(fs.existsSync("public/image/" + resp.body.images[2].path)).toBeTruthy()
          arrayPathImage.push(resp.body.images[2])
      });


      test(" delete one image to a plant ", async () => {
        const resp = await request(app).delete("/api/plant/deleteImage/"+plantIdToGet+"/"+arrayPathImage[0]._id)
          .set('Cookie', cookieJWTUser)
          expect(resp.statusCode).toBe(200)
          expect(resp.body.name).toEqual("Ma plante ( Ocimum diffusus )")
          expect(resp.body.images.length).toEqual(2)
          expect(fs.existsSync("public/image/" + arrayPathImage[0].path)).toBeFalsy()
      });

      test(" delete one image to a plant without botanist account ", async () => {
        const resp = await request(app).delete("/api/plant/deleteImage/"+plantIdToGet+"/"+arrayPathImage[0]._id)
          .set('Cookie', cookieJWTUser)
          expect(resp.statusCode).toBe(404)

      });

      test(" delete one image to a plant ", async () => {
        const resp = await request(app).delete("/api/plant/deleteImage/"+plantIdToGet+"/"+arrayPathImage[1]._id)
          .set('Cookie', cookieJWTUser)
          expect(resp.statusCode).toBe(200)
          expect(resp.body.name).toEqual("Ma plante ( Ocimum diffusus )")
          expect(resp.body.images.length).toEqual(1)
          expect(fs.existsSync("public/image/" + arrayPathImage[1].path)).toBeFalsy()
      });


      test(" delete one plant with wrong token ", async () => {

        const resp = await request(app).delete("/api/plant/"+plantIdToGet)
          .set('Cookie', cookieJWTBotanist)
          expect(resp.statusCode).toBe(404)

      });

      test(" delete one plant ", async () => {

        const resp = await request(app).delete("/api/plant/"+plantIdToGet)
          .set('Cookie', cookieJWTUser)
          expect(resp.statusCode).toBe(200)
          expect(fs.existsSync("public/image/" + arrayPathImage[2].path)).toBeFalsy()
      });

      test("get one plant deleted", async () => {

        const resp = await request(app).get("/api/plant/"+plantIdToGet)
          .set('Content-type', 'application/json')
          .set('Cookie', cookieJWTUser)
          expect(resp.statusCode).toBe(404)
    
  
      });
  

      

    })



    describe("update plants  ", () => {
      let plantIdToGet:String|null = null
      beforeAll(async()=>{
         const resp = await request(app).post("/api/plant")
          .set('Content-type', 'application/json')
          .set('Cookie', cookieJWTUser)
          .send({ 
        "name":"test_update",
          "speciesId": mySpeciesId[0],
       })
       
       plantIdToGet = resp.body._id
       
        });
  
       
     
        test("update plant  ", async () => {
            

          const resp = await request(app).post("/api/plant/"+plantIdToGet)
           .set('Content-type', 'application/json')
            .set('Cookie', cookieJWTUser)
            .send({ 
                "name":"test_update_updated",
                "speciesId": mySpeciesId[1],
               })
            console.log(resp.body,"bodyyy")
            expect(resp.statusCode).toBe(200)
            expect(resp.body.name).toBe("test_update_updated");
            expect(resp.body.species._id).toBe(mySpeciesId[1]);
        });

        
       
  
        test("update species without wrong jwt account", async () => {
          const resp = await request(app).post("/api/species/"+plantIdToGet)
          .set('Content-type', 'application/json')
            .set('Cookie', cookieJWTBotanist)
            .send({ 
                "name":"test_update_updated",
                  "speciesId": mySpeciesId[1],
               })
            expect(resp.statusCode).toBe(404)
  
        });
  
  
  
        
  
      })