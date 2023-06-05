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

async function login(email: string, password: string) {
    const respLogin = await request("https://api-arosaje-test.locascio.fr").post("/api/auth/login")
        .set('Content-type', 'application/json')
        .send({"email": email, "password": password});

    return {
        "statusCode": (respLogin.statusCode == 200),
        "jwt": (respLogin.statusCode == 200) ? respLogin.body.jwt : ""
    }
}

export const loginWithUserRight = async () => {
    let loginData = await login("jwttoken@hotmail.com", "123456")
    if(!loginData["statusCode"]){
        await createAccountWithUserRight()
        loginData = await login("jwttoken@hotmail.com", "123456")
    }

    const respUserInfo =  await request("https://api-arosaje-test.locascio.fr").get("/api/auth/me")
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + loginData["jwt"])
    return {
        "JWTUser": loginData["jwt"],
        "idUser": respUserInfo.body._id
    }
}

export const loginWithBotanistRight = async(JWTUser: string) => {

    let loginData = await login("botanist@email.fr", "123456")

    if(!loginData["statusCode"]){
        await createAccountWithBotanistRight(JWTUser)
        loginData = await login("botanist@email.fr", "123456")
    }

    const respBotanistInfo =  await request("https://api-arosaje-test.locascio.fr").get("/api/auth/me")
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + loginData["jwt"])

    return {
        "JWTBotanist": loginData["jwt"],
        "idBotanist": respBotanistInfo.body._id
    }
}