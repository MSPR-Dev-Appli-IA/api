import {loginWithBotanistRight, loginWithUserRight} from "../data/accounts.data";
import {getAllSpecies} from "../utils/species";
import {getAllPlants} from "../utils/plant";
import {dataPlants} from "../data/plant.data";

const request = require("supertest");
// import { closeDatabase } from '../utils/db-handler'
// import * as fs from 'fs';



let userInfo: any
let botanistInfo: any
let mySpeciesId: string[] = []
let myPlants: any
let myFirstPlant: any
let myPlantInfo: any

beforeAll(async () => {

    userInfo = await loginWithUserRight()
    botanistInfo = await loginWithBotanistRight(userInfo['JWTUser'])

    mySpeciesId = await getAllSpecies(botanistInfo["JWTBotanist"], mySpeciesId)
    myPlants = await getAllPlants(userInfo['JWTUser'], mySpeciesId)

    myFirstPlant = myPlants[0]

}, 300000)

// TODO FIX IT
// afterAll(() => {
//     closeDatabase()
// }
// );


describe("create plants ", () => {

    test("create one plant with user account ", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
            .send({"name": "Rosa", "speciesId": mySpeciesId[0]})
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual(expect.objectContaining({"status": "success"}))
    });

    test("create one plant with no name", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
            .send({"speciesId": mySpeciesId[0]})
        expect(resp.statusCode).toBe(400)
        expect(resp.body).toEqual(expect.objectContaining({
            "field": ["name"],
            "message": ["\"name\" is required"]
        }))
    });

    test("create one plant with botanist account", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])
            .send({"name": "Rosa botanist", "speciesId": mySpeciesId[0]})
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual(expect.objectContaining({"status": "success"}))
    });

    test("create one plant without species", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])
            .send({"name": "Rosa botanist 2"})
        expect(resp.statusCode).toBe(400)
        expect(resp.body).toEqual(expect.objectContaining({
            "field": ["speciesId"],
            "message": ["\"speciesId\" is required"]
        }))
    });


    test("create one plant without auth", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant")
            .set('Content-type', 'application/json')
            .send({"name": "Rosa", "speciesId": mySpeciesId[0],
            })

        expect(resp.statusCode).toBe(401)
        expect(resp.body).toEqual(expect.objectContaining({
            "field": ["error"],
            "message": "Bad token. You must to logged in before"
        }))
    });
})

describe("get plants", () => {

    test("get my plants with botanist account", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/plant")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])

        expect(resp.statusCode).toBe(200)
        expect(resp.body.result.length).toEqual(1)
        expect(resp.body['result'][0]).toEqual(expect.objectContaining({"name": "Rosa botanist"}))
    })


    test("get some of my plants without token  ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/plant")
          .set('Content-type', 'application/json')
          expect(resp.statusCode).toBe(401)
          expect(resp.body).toMatchObject({
              "field": ["error"],
              "message": "Bad token. You must to logged in before"
          })
    });

    test("get some of my plants with one species", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/plant")
            .set('Content-type', 'application/json')
            .send({"speciesId": mySpeciesId[3]})
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])

        expect(resp.statusCode).toBe(200)
        expect(resp.body.result.length).toEqual(1)
        expect(resp.body.result[0].name).toEqual("Rosa botanist")

    });

    test("get some of my plants with order asc ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/plant")
            .set('Content-type', 'application/json')
            .send({"order": "ASC"})
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])

        expect(resp.statusCode).toBe(200)
        expect(resp.body.result.length).toEqual(5)
        expect(resp.body.result[0].name).toEqual("Rosa")
        expect(resp.body.result[1].name).toEqual(dataPlants[3])
        expect(resp.body.result[2].name).toEqual(dataPlants[2])
        expect(resp.body.result[3].name).toEqual(dataPlants[1])
        expect(resp.body.result[4].name).toEqual(dataPlants[0])
    });


    test("get some of my plants with search ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/plant?search=Rosa%20m")
            .set('Content-type', 'application/json')
            .send({"search": "Rosa m"})
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
        expect(resp.statusCode).toBe(200)
        expect(resp.body.result.length).toEqual(1)

    });


    test("get one of my plant", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/plant/" + myFirstPlant._id)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
        expect(resp.statusCode).toBe(200)
        expect(resp.body.name).toEqual(myFirstPlant.name)

    });

    test("get one plant with wrong jwt token", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/plant/" + myFirstPlant._id)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toMatchObject({
            "name":  myFirstPlant.name
        })
    });

    test("get one plant with not an ObjectId ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/plant/534651")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
        expect(resp.statusCode).toBe(400)
        expect(resp.body).toMatchObject({
            "field": ["plantId"],
            "message": ["\"plantId\" length must be 24 characters long"]
        })
    })
})

describe("add plant images", () => {
    test("add image to a plant ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant/addImage")
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
            .attach('file', `public/testImage/rosa.jpg`)
            .field("plantId", myFirstPlant._id)
        expect(resp.statusCode).toBe(200)
        expect(resp.body.status).toEqual("success")
    });


    test("add another image to a plant ", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant/addImage")
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
            .field("plantId", myFirstPlant._id)
            .attach('file', `public/testImage/rosa.jpg`)

        expect(resp.statusCode).toBe(200)

        const plantInfo = await request("https://api-arosaje-test.locascio.fr").get(resp.body.plantInfo)
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])

        expect(plantInfo.body.images.length).toEqual(2)
        expect(plantInfo.body.name).toEqual(myFirstPlant.name)
    });
})

describe("delete plant and image", () => {

    beforeEach(async () => {
        myPlantInfo = await request("https://api-arosaje-test.locascio.fr").get(myFirstPlant.plantInfo)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
    }, 300000)

    test("delete one image to a plant ", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").delete("/api/plant/deleteImage/" + myPlantInfo.body._id + "/" + myPlantInfo.body.images[0]._id)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({type: "success", message: "File deleted"})

    });

    test("delete plant", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").delete("/api/plant/" + myPlants[1]._id)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({type: "success", message: "Plant deleted"})
    })

})



//
//
//
// describe("update plants  ", () => {
//       let plantIdToGet:String|null = null
//       beforeAll(async()=>{
//          const resp = await request(app).post("/api/plant")
//           .set('Content-type', 'application/json')
//           .set('Cookie', cookieJWTUser)
//           .send({
//         "name":"test_update",
//           "speciesId": mySpeciesId[0],
//        })
//
//        plantIdToGet = resp.body._id
//
//         });
//
//
//
//         test("update plant  ", async () => {
//
//
//           const resp = await request(app).post("/api/plant/"+plantIdToGet)
//            .set('Content-type', 'application/json')
//             .set('Cookie', cookieJWTUser)
//             .send({
//                 "name":"test_update_updated",
//                 "speciesId": mySpeciesId[1],
//                })
//             console.log(resp.body,"bodyyy")
//             expect(resp.statusCode).toBe(200)
//             expect(resp.body.name).toBe("test_update_updated");
//             expect(resp.body.species._id).toBe(mySpeciesId[1]);
//         });
//
//
//
//
//         test("update species without wrong jwt account", async () => {
//           const resp = await request(app).post("/api/species/"+plantIdToGet)
//           .set('Content-type', 'application/json')
//             .set('Cookie', cookieJWTBotanist)
//             .send({
//                 "name":"test_update_updated",
//                   "speciesId": mySpeciesId[1],
//                })
//             expect(resp.statusCode).toBe(404)
//
//         });
//
//
//
//
//
//       })