import request from "supertest";
import {getAllSpecies} from "./species";

async function createPlants(jwtToken: string) {
    const allSpecies: any[] = await getAllSpecies(jwtToken)

    const dataPlants:string[] = [
        "Rosa laevigata", "Rosa mosqueta", "Rosa agrestis", "Rosa orientalis"
    ]

    const myPlants: any[] = []

    for (let i = 0; i < dataPlants.length; i++){
        const randomNumber = Math.floor(Math.random() * allSpecies.length);
        const resp = await request("https://api-arosaje-test.locascio.fr").post("/api/plant")
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({
                "name": dataPlants[i],
                "speciesId": allSpecies[randomNumber]._id
            })
        const plantInfo = await request("https://api-arosaje-test.locascio.fr").get(resp.body.plantInfo)
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + jwtToken)
        myPlants.push(plantInfo.body)
    }
    return myPlants
}

export const getAllPlants = async (jwtToken: string) => {
    const getAllPlants = await request("https://api-arosaje-test.locascio.fr").get("/api/plant")
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + jwtToken)

    return (getAllPlants.body.result.length !== 0) ? getAllPlants.body.result : await createPlants(jwtToken)
}