import {IUserLocal, UserForm} from "../../interfaces";
import {userSignupValidation} from "../../database/validation/user.validation";
import {JwtService} from "./jwtService";
import {addUserJWTToken, findUserPerEmail, findUserPerId} from "../../queries/user.queries";

const jwtService = new JwtService()

export class UserService{
    jwtToken: any;

    constructor() {
    }

    async createUser(body: UserForm){
        await userSignupValidation.validateAsync(body, {abortEarly: false});

        await this.createUser(body);
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
        const user = await findUserPerId(userId);
        if (user) {
            return user
        } else {
            return false
        }
    }
}