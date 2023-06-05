import request from "supertest";
import {dataSpecies} from "../data/species.data";
let mySpecies:object[]=[]
async function createSpecies(jwtToken: string) {
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

        const speciesInfo = await request("https://api-arosaje-test.locascio.fr").get(resp.body.path)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + jwtToken)
        mySpecies.push(speciesInfo.body)
    }, Promise.resolve());

    return mySpecies
}

export const getAllSpecies = async (jwtToken: string) => {
    const getAllSpecies = await request("https://api-arosaje-test.locascio.fr").get("/api/species")
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + jwtToken)

    if(getAllSpecies.body.length !== 0){
        for (const species of getAllSpecies.body) {
            const speciesInfo = await request("https://api-arosaje-test.locascio.fr").get(species.speciesInfo)
                .set('Content-type', 'application/json')
                .set('Authorization', 'Bearer ' + jwtToken)
            mySpecies.push(speciesInfo.body)
        }
    }else{
        await createSpecies(jwtToken)
    }

    return mySpecies
}