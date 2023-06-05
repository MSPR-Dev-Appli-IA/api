import request from "supertest";
import {loginWithBotanistRight, loginWithUserRight} from "../data/accounts.data";
import {getAllSpecies} from "../utils/species";

let userInfo: any
let botanistInfo: any
let mySpeciesId: any[] = []
beforeAll(async () => {
    userInfo = await loginWithUserRight()
    botanistInfo = await loginWithBotanistRight(userInfo['JWTUser'])

    mySpeciesId = await getAllSpecies(botanistInfo["JWTBotanist"])
}, 300000);


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


describe("get species", () => {

    test("get some species ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/species")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])
        expect(resp.statusCode).toBe(200)
        expect(resp.body.length).toEqual(5)
    });


    test("get some species without token  ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/species")
            .set('Content-type', 'application/json')
        expect(resp.statusCode).toBe(401)
        expect(resp.body).toMatchObject({
            "field": ["error"],
            "message": "Bad token. You must to logged in before"
        })
    });

    test("get some species with order asc ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/species?order=ASC")
            .set('Content-type', 'application/json')
            .send({"": "ASC"})
            .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
        expect(resp.statusCode).toBe(200)
    });


    test("get some species with search ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/species?search=la")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
        expect(resp.statusCode).toBe(200)

    });


    test("get one species", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/species/" + mySpeciesId[0]._id)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo["JWTUser"])

        expect(resp.statusCode).toBe(200)
        expect(resp.body.name).toEqual(mySpeciesId[0].name)

    });

    test("get one species without jwt token", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/species/" + mySpeciesId[0]._id)
            .set('Content-type', 'application/json')
        expect(resp.statusCode).toBe(401)
        expect(resp.body).toMatchObject({
            "field": ["error"],
            "message": "Bad token. You must to logged in before"
        })
    });

    test("get one species with wrong Id ", async () => {

        const resp = await request("https://api-arosaje-test.locascio.fr").get("/api/species/534651")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + userInfo["JWTUser"])
        expect(resp.statusCode).toBe(500)
        expect(resp.body).toMatchObject({field: ["error"], message: ["An error was occurred. Please contact us."]})

    });
});


describe("add & delete species images", () => {

    test("add image to a species ", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/species/addImage")
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])
            .attach('file', `public/testImage/rosa.jpg`)
            .field("speciesId", mySpeciesId[0]._id)
        expect(resp.statusCode).toBe(200)
        expect(resp.body.status).toEqual("success")
    });


    test("add another image to a plant ", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/species/addImage")
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])
            .attach('file', `public/testImage/rosa.jpg`)
            .field("speciesId", mySpeciesId[0]._id)
        expect(resp.statusCode).toBe(200)
        expect(resp.body.status).toEqual("success")
    });

    test("delete species", async () => {
        const resp = await request("https://api-arosaje-test.locascio.fr").delete("/api/species/" + mySpeciesId[1]._id)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + botanistInfo["JWTBotanist"])
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({type: "success", message: "Plant deleted"})
    })
})