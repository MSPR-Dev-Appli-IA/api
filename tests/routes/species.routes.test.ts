import request from "supertest";
// import { closeDatabase } from '../utils/db-handler'
// import { app } from "../../src/index";
// import { createAccountWithBotanistRight } from "../../src/controllers/auth.controller";
// import {dataSpecies} from "../data/species.data";
import {loginWithBotanistRight, loginWithUserRight} from "../data/accounts.data";
// import { IImage } from "../../src/interfaces";

let userInfo: any
let botanistInfo: any
beforeAll(async () => {
    userInfo = await loginWithUserRight()
    botanistInfo = await loginWithBotanistRight(userInfo['JWTUser'])
});


describe("create species", () => {
    test("create species ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/species")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])
            .send({
                "name": "Rosa",
                "description": "Voila ma deszcription",
                "sunExposure": "A lombre en vrai",
                "watering": "l'eau dans 20 30 ans yen aura plus",
                "optimalTemperature": "50"
            })
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual(expect.objectContaining({
            status: "success"
        }))
    });

    test("create species with the same name ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/species")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])
            .send({
                "name": "Rosa",
                "description": "Voila ma deszcription",
                "sunExposure": "A lombre en vrai",
                "watering": "l'eau dans 20 30 ans yen aura plus",
                "optimalTemperature": "50"
            })
        expect(resp.statusCode).toBe(400)
        expect(resp.body).toEqual(expect.objectContaining({
            "field": ["error"],
            "message": ["Duplicate key error."]
        }))
    });

    test("create species without botanist account ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/species")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
            .send({
                "name": "rosa78",
                "description": "Voila ma deszcription",
                "sunExposure": "A lombre en vrai",
                "watering": "l'eau dans 20 30 ans yen aura plus",
                "optimalTemperature": "50"
            })
        expect(resp.statusCode).toBe(401)
        expect(resp.body).toMatchObject({
            "field": ["error"],
            "message": ["Bad token or Invalid Permission."]
        })
    });

    test("create species without logged", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/species")
            .set('Content-type', 'application/json')
            .send({
                "name": "rosa78",
                "description": "Voila ma deszcription",
                "sunExposure": "A lombre en vrai",
                "watering": "l'eau dans 20 30 ans yen aura plus",
                "optimalTemperature": "50"
            })
        expect(resp.statusCode).toBe(401)
        expect(resp.body).toMatchObject({
            "field": ["error"],
            "message": "Bad token. You must to logged in before"
        })
    });
});


// describe("get species", () => {
//   let speciesIdToGet:String|null = null
//   beforeAll(async()=>{
//     dataSpecies.forEach(async(element,index) => {
//      const resp = await request(app).post("/api/species")
//       .set('Content-type', 'application/json')
//       .set('Cookie', cookieJWTBotanist)
//       .send({ "name":element.name,
//       "description":element.description,
//       "sunExposure":element.sunExposure,
//       "watering":element.watering,
//       "optimalTemperature":element.optimalTemperature
//    })
//    if (index==0){
//     speciesIdToGet = resp.body._id
//    }
//
//     });
//   })
//
//   test("get some species ", async () => {
//
//     const resp = await request(app).get("/api/species")
//       .set('Content-type', 'application/json')
//       .set('Cookie', cookieJWTUser)
//       expect(resp.statusCode).toBe(200)
//       expect(resp.body.length).toEqual(5)
//       expect(resp.body[0].name).toEqual("Ruta calleryana")
//       expect(resp.body[1].name).toEqual("Rosa")
//       expect(resp.body[2].name).toEqual('Porteranthus ensata')
//       expect(resp.body[3].name).toEqual('Paulownia vilarri')
//       expect(resp.body[4].name).toEqual('Ocimum diffusus')
//   });
//
//
//   test("get some species without token  ", async () => {
//
//     const resp = await request(app).get("/api/species")
//       .set('Content-type', 'application/json')
//       expect(resp.statusCode).toBe(404)
//       expect(resp.body).toMatchObject({ message: "Your are not logged in" })
//
//   });
//
//   test("get some species with page ", async () => {
//
//     const resp = await request(app).get("/api/species")
//       .set('Content-type', 'application/json')
//       .send({"page":2})
//       .set('Cookie', cookieJWTUser)
//       expect(resp.statusCode).toBe(200)
//       expect(resp.body.length).toEqual(5)
//       expect(resp.body[0].name).toEqual("Nelumbo pumila")
//       expect(resp.body[1].name).toEqual('Echium hemisphaerica')
//       expect(resp.body[2].name).toEqual('Dionaea crispum')
//       expect(resp.body[3].name).toEqual('Callistephus speciosa')
//       expect(resp.body[4].name).toEqual('Botrychium laevis')
//   });
//
//
//   test("get some species with order asc ", async () => {
//
//     const resp = await request(app).get("/api/species")
//       .set('Content-type', 'application/json')
//       .send({"order":"ASC"})
//       .set('Cookie', cookieJWTUser)
//       expect(resp.statusCode).toBe(200)
//       expect(resp.body.length).toEqual(5)
//       expect(resp.body[0].name).toEqual("Amelanchier nokoense")
//       expect(resp.body[1].name).toEqual('Botrychium laevis')
//       expect(resp.body[2].name).toEqual('Callistephus speciosa')
//       expect(resp.body[3].name).toEqual('Dionaea crispum')
//       expect(resp.body[4].name).toEqual('Echium hemisphaerica')
//
//
//   });
//
//
//   test("get some species with search ", async () => {
//
//     const resp = await request(app).get("/api/species")
//       .set('Content-type', 'application/json')
//       .send({"search":"la"})
//       .set('Cookie', cookieJWTUser)
//       expect(resp.statusCode).toBe(200)
//       expect(resp.body.length).toEqual(4)
//       expect(resp.body[0].name).toEqual("Paulownia vilarri")
//       expect(resp.body[1].name).toEqual("Nelumbo pumila")
//       expect(resp.body[2].name).toEqual("Botrychium laevis")
//       expect(resp.body[3].name).toEqual("Amelanchier nokoense")
//
//   });
//
//
//   test("get one species", async () => {
//
//     const resp = await request(app).get("/api/species/"+speciesIdToGet)
//       .set('Content-type', 'application/json')
//       .set('Cookie', cookieJWTUser)
//
//       expect(resp.statusCode).toBe(200)
//       expect(resp.body.name).toEqual("Ocimum diffusus")
//
//   });
//
//   test("get one species without jwt token", async () => {
//
//     const resp = await request(app).get("/api/species/"+speciesIdToGet)
//       .set('Content-type', 'application/json')
//       expect(resp.statusCode).toBe(404)
//
//
//   });
//
//   test("get one species with wrong Id ", async () => {
//
//     const resp = await request(app).get("/api/species/534651")
//       .set('Content-type', 'application/json')
//       .set('Cookie', cookieJWTUser)
//       expect(resp.statusCode).toBe(404)
//
//   });
//
// });
//
//
// describe("species and image ", () => {
//   let speciesIdToGet:String|null = null
//   let arrayPathImage:IImage[]= []
//   beforeAll(async()=>{
//
//      const resp = await request(app).post("/api/species")
//       .set('Content-type', 'application/json')
//       .set('Cookie', cookieJWTBotanist)
//       .send({ "name":"test_image",
//       "description":"desscription test image ",
//       "sunExposure":"sun exposure test image 9",
//       "watering":"watering test image ",
//       "optimalTemperature":"optimal temperature test image "
//    })
//
//    speciesIdToGet = resp.body._id
//
//     });
//
//
//     test("add image to a species ", async () => {
//       const resp = await request(app).post("/api/species/addImage/"+speciesIdToGet)
//         .set('Content-Type','multipart/form-data')
//         .set('Cookie', cookieJWTBotanist)
//         .attach('file', `public/testImage/rosa.jpg`)
//         expect(resp.statusCode).toBe(200)
//         expect(resp.body.name).toEqual("test_image")
//         expect(resp.body.images.length).toEqual(1)
//         expect(fs.existsSync("public/image/" + resp.body.images[0].path)).toBeTruthy()
//         arrayPathImage.push(resp.body.images[0])
//     });
//
//     test("add image to a species without botanist account ", async () => {
//       const resp = await request(app).post("/api/species/addImage/"+speciesIdToGet)
//         .set('Content-Type','multipart/form-data')
//         .set('Cookie', cookieJWTUser)
//         .attach('file', `public/testImage/rosa.jpg`)
//         expect(resp.statusCode).toBe(404)
//
//     });
//
//
//
//     test("add another image to a species ", async () => {
//       const resp = await request(app).post("/api/species/addImage/"+speciesIdToGet)
//         .set('Content-Type','multipart/form-data')
//         .set('Cookie', cookieJWTBotanist)
//         .attach('file', `public/testImage/rosa.jpg`)
//         expect(resp.statusCode).toBe(200)
//         expect(resp.body.name).toEqual("test_image")
//         expect(resp.body.images.length).toEqual(2)
//         expect(fs.existsSync("public/image/" + resp.body.images[1].path)).toBeTruthy()
//         arrayPathImage.push(resp.body.images[1])
//     });
//
//     test("add another image to a species ", async () => {
//       const resp = await request(app).post("/api/species/addImage/"+speciesIdToGet)
//         .set('Content-Type','multipart/form-data')
//         .set('Cookie', cookieJWTBotanist)
//         .attach('file', `public/testImage/rosa.jpg`)
//         expect(resp.statusCode).toBe(200)
//         expect(resp.body.name).toEqual("test_image")
//         expect(resp.body.images.length).toEqual(3)
//         expect(fs.existsSync("public/image/" + resp.body.images[2].path)).toBeTruthy()
//         arrayPathImage.push(resp.body.images[2])
//     });
//
//
//     test(" delete one image to a species ", async () => {
//       const resp = await request(app).delete("/api/species/deleteImage/"+speciesIdToGet+"/"+arrayPathImage[0]._id)
//         .set('Cookie', cookieJWTBotanist)
//         expect(resp.statusCode).toBe(200)
//         expect(resp.body.name).toEqual("test_image")
//         expect(resp.body.images.length).toEqual(2)
//         expect(fs.existsSync("public/image/" + arrayPathImage[0].path)).toBeFalsy()
//     });
//
//     test(" delete one image to a species without botanist account ", async () => {
//       const resp = await request(app).delete("/api/species/deleteImage/"+speciesIdToGet+"/"+arrayPathImage[0]._id)
//         .set('Cookie', cookieJWTUser)
//         expect(resp.statusCode).toBe(404)
//
//     });
//
//     test(" delete one image to a species ", async () => {
//       const resp = await request(app).delete("/api/species/deleteImage/"+speciesIdToGet+"/"+arrayPathImage[1]._id)
//         .set('Cookie', cookieJWTBotanist)
//         expect(resp.statusCode).toBe(200)
//         expect(resp.body.name).toEqual("test_image")
//         expect(resp.body.images.length).toEqual(1)
//         expect(fs.existsSync("public/image/" + arrayPathImage[1].path)).toBeFalsy()
//     });
//
//
//     test(" delete one species without botanist token ", async () => {
//
//       const resp = await request(app).delete("/api/species/"+speciesIdToGet)
//         .set('Cookie', cookieJWTUser)
//         expect(resp.statusCode).toBe(404)
//
//     });
//
//     test(" delete one species ", async () => {
//
//       const resp = await request(app).delete("/api/species/"+speciesIdToGet)
//         .set('Cookie', cookieJWTBotanist)
//         expect(resp.statusCode).toBe(200)
//         expect(fs.existsSync("public/image/" + arrayPathImage[2].path)).toBeFalsy()
//     });
//
//     test("get one species deleted", async () => {
//
//       const resp = await request(app).get("/api/species/"+speciesIdToGet)
//         .set('Content-type', 'application/json')
//         .set('Cookie', cookieJWTUser)
//         expect(resp.statusCode).toBe(404)
//
//
//     });
//
//
//
//
//   })
//
//
//
//   describe("update species  ", () => {
//     let speciesIdToGet:String|null = null
//     beforeAll(async()=>{
//        const resp = await request(app).post("/api/species")
//         .set('Content-type', 'application/json')
//         .set('Cookie', cookieJWTBotanist)
//         .send({ "name":"test_update",
//         "description":"desscription test update ",
//         "sunExposure":"sun exposure test update",
//         "watering":"watering test update ",
//         "optimalTemperature":"optimal temperature test update "
//      })
//
//      speciesIdToGet = resp.body._id
//
//       });
//
//       const upload_payload ={ "name":"test_update_after",
//       "description":"desscription test update ",
//       "sunExposure":"sun exposure test update after ",
//       "watering":"watering test update ",
//       "optimalTemperature":"optimal temperature test update "
//    }
//
//       test("update species  ", async () => {
//         const resp = await request(app).post("/api/species/"+speciesIdToGet)
//          .set('Content-type', 'application/json')
//           .set('Cookie', cookieJWTBotanist)
//           .send(upload_payload)
//           expect(resp.statusCode).toBe(200)
//           expect(resp.body).toEqual(expect.objectContaining(upload_payload))
//
//       });
//
//       test("update species with same name   ", async () => {
//         const resp = await request(app).post("/api/species/"+speciesIdToGet)
//          .set('Content-type', 'application/json')
//           .set('Cookie', cookieJWTBotanist)
//           .send({ "name":"Rosa",
//           "description":"desscription test update ",
//           "sunExposure":"sun exposure test update after ",
//           "watering":"watering test update ",
//           "optimalTemperature":"optimal temperature test update "
//        })
//           expect(resp.statusCode).toBe(404)
//
//       });
//
//       test("update species without botanist account", async () => {
//         const resp = await request(app).post("/api/species/"+speciesIdToGet)
//         .set('Content-type', 'application/json')
//           .set('Cookie', cookieJWTUser)
//           .send(upload_payload)
//           expect(resp.statusCode).toBe(404)
//
//       });
//
//
//
//
//
//     })