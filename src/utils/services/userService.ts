import {IUserLocal, UserForm} from "../../interfaces";
import {userSignupValidation} from "../../database/validation/user.validation";
import {JwtService} from "./jwtService";
import {addUserJWTToken, createUser, findUserPerEmail, findUserPerId} from "../../queries/user.queries";
import {getDefaultRole} from "../../queries/role.queries";

const jwtService = new JwtService()

export class UserService{
    jwtToken: any;

    constructor() {
    }

    async createUser(body: UserForm){
        await userSignupValidation.validateAsync(body, {abortEarly: false});

        await createUser(body, await getDefaultRole())
    }

    async loginUser(body: IUserLocal){
        const user = await findUserPerEmail(body.email);

        if (user) {
            const match = user.comparePassword(body.password);
            if (match) {

                const jwtToken = jwtService.createJwtToken({user: user, id: undefined})
                await addUserJWTToken(user._id, jwtToken)
                this.jwtToken = jwtToken
                return true
            }
        }
        return false
    }

    async checkUserExist(userId: string) {
        return await findUserPerId(userId);
    }
}