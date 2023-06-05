import {loginWithBotanistRight, loginWithUserRight} from "../data/accounts.data";
import {getAllSpecies} from "../utils/species";
import {getAllPlants} from "../utils/plant";

const request = require("supertest");


let userInfo: any
let botanistInfo: any
let mySpeciesId: any[] = []
let myPlants: any

beforeAll(async () => {

    userInfo = await loginWithUserRight()
    botanistInfo = await loginWithBotanistRight(userInfo['JWTUser'])

    mySpeciesId = await getAllSpecies(botanistInfo["JWTBotanist"])
    myPlants = await getAllPlants(userInfo['JWTUser'])

}, 300000)

describe("create plants ", () => {

    test("create one plant with user account ", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
            .send({"name": "Rosa", "speciesId": mySpeciesId[0]._id})
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual(expect.objectContaining({"status": "success"}))
    });

    test("create one plant with no name", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
            .send({"speciesId": mySpeciesId[0]._id})
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
            .send({"name": "Rosa botanist", "speciesId": mySpeciesId[0]._id})
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
            .send({
                "name": "Rosa", "speciesId": mySpeciesId[0]._id,
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
            .send({"speciesId": mySpeciesId[3]._id})
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])

        expect(resp.statusCode).toBe(200)
    });

    test("get one of my plant", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/plant/" + myPlants[0]._id)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
        expect(resp.statusCode).toBe(200)
        expect(resp.body.name).toEqual(myPlants[0].name)
    });

    test("get one plant with wrong jwt token", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/plant/" + myPlants[0]._id)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])
        expect(resp.statusCode).toBe(200)
    });

    test("get one plant with not an ObjectId ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/plant/534651")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
        expect(resp.statusCode).toBe(400)
        expect(resp.body).toEqual(expect.objectContaining({
            "field": ["plantId"],
            "message": ["\"plantId\" length must be 24 characters long"]
        }))
    })
})

describe("add & delete plant images", () => {
    test("add image to a plant ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant/addImage")
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
            .attach('file', `public/testImage/rosa.jpg`)
            .field("plantId", myPlants[0]._id)
        expect(resp.statusCode).toBe(200)
        expect(resp.body.status).toEqual("success")
    });


    test("add another image to a plant ", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant/addImage")
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
            .field("plantId", myPlants[0]._id)
            .attach('file', `public/testImage/rosa.jpg`)

        expect(resp.statusCode).toBe(200)
    });

    test("delete plant", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").delete("/api/plant/" + myPlants[1]._id)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({type: "success", message: "Plant deleted"})
    })
})

describe("update plants", () => {
    test("update plant  ", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").put("/api/plant")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo['JWTUser'])
            .send({
                "name": "test_update_updated",
                "plantId": myPlants[2]._id,
                "speciesId": mySpeciesId[1]._id,
            })

        expect(resp.statusCode).toBe(200)
        expect(resp.body.status).toEqual("success")
    });
})