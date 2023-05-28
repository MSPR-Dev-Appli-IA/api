import request from "supertest";
import {dataSpecies} from "../data/species.data";

async function createSpecies(jwtToken: string, mySpeciesId: string[]) {
    await dataSpecies.reduce(async (a, element) => {
        // Wait for the previous item to finish processing
        await a;
        // Process this item

        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/species")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({
                "name": element.name,
                "description": element.description,
                "sunExposure": element.sunExposure,
                "watering": element.watering,
                "optimalTemperature": element.optimalTemperature
            })
        mySpeciesId.push(resp.body._id)
    }, Promise.resolve());

    return mySpeciesId
}

export const getAllSpecies = async (jwtToken: string, mySpeciesId: string[]) => {
    const getAllSpecies = await request("https://api-arosaje-test.locascio.fr").get("/api/species")
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + jwtToken)

    getAllSpecies.body.forEach((species: any) => {
        mySpeciesId.push(species.url.split('/')[species.url.split('/').length - 1])
    })

    return (mySpeciesId.length !== 0) ? mySpeciesId : await createSpecies(jwtToken, mySpeciesId)
}