import request from "supertest";
import {getAllSpecies} from "./species";

async function createPlants(jwtToken: string, mySpeciesId: string[]) {
    const allSpeciesInfo = await getAllSpecies(jwtToken, mySpeciesId)

    const dataPlants:string[] = [
        "Rosa laevigata", "Rosa mosqueta", "Rosa agrestis", "Rosa orientalis"
    ]

    const myPlants: any[] = []

    for (let i = 0; i < dataPlants.length; i++){
        const randomNumber = Math.floor(Math.random() * allSpeciesInfo.length);
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({
                "name": dataPlants[i],
                "speciesId": allSpeciesInfo[randomNumber]
            })
        myPlants.push(resp.body)
    }
    return myPlants
}

export const getAllPlants = async (jwtToken: string, mySpeciesId: string[]) => {
    const getAllPlants = await request("https://api-arosaje-test.locascio.fr").get("/api/plant")
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + jwtToken)

    return (getAllPlants.body.result.length !== 0) ? getAllPlants.body.result : await createPlants(jwtToken, mySpeciesId)
}