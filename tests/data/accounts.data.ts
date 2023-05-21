import request from "supertest";
async function createAccountWithUserRight() {
    await request("https://api-arosaje-test.locascio.fr").post("/api/auth/register")
        .set('Content-type', 'application/json')
        .send({
            "username": "testjwt",
            "firstname": "tesjwt",
            "lastname": "teurff",
            "email": "jwttoken@hotmail.com",
            "password": "123456"
        });

}

async function createAccountWithBotanistRight(JWTUser: string){
    await request("https://api-arosaje-test.locascio.fr").post("/api/auth/createDefaultBotanist")
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + JWTUser)
}
export const loginWithUserRight = async () => {

    await createAccountWithUserRight()

    const respUser = await request("https://api-arosaje-test.locascio.fr").post("/api/auth/login")
        .set('Content-type', 'application/json')
        .send({"email": "jwttoken@hotmail.com", "password": "123456"});

    const respUserInfo =  await request("https://api-arosaje-test.locascio.fr").get("/api/auth/me")
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + respUser.body.jwt)
    return {
        "JWTUser": respUser.body.jwt,
        "idUser": respUserInfo.body._id
    }
}

export const loginWithBotanistRight = async(JWTUser: string) => {

    await createAccountWithBotanistRight(JWTUser)

    const respBotanist = await request("https://api-arosaje-test.locascio.fr").post("/api/auth/login")
        .set('Content-type', 'application/json')
        .send({ "email": "botanist@email.fr", "password": "123456" });

    const respBotanistInfo =  await request("https://api-arosaje-test.locascio.fr").get("/api/auth/me")
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + respBotanist.body.jwt)

    return {
        "JWTBotanist": respBotanist.body.jwt,
        "idBotanist": respBotanistInfo.body._id
    }
}