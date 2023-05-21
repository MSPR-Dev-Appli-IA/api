import {createUser} from "../queries/user.queries";
import {NextFunction, Request, Response} from "express";
import {getBotanistRole} from "../queries/role.queries";
import {return400or500Errors} from "../utils";
import {UserService} from "../services/userService";
import {JwtService} from "../services/jwtService";

const userService = new UserService();
const jwtService = new JwtService();

/*
 * POST /api/auth/login
 * Log-in a user using its credentials.
 */
export const login = async (req: Request, res: Response, _: NextFunction) => {
    try {
        await (userService.loginUser(req.body))
            ? res.status(200).send({
                status: "You're logged in.",
                jwt: userService.jwtToken
            })
            : res.status(404).send({
                field: ["error"],
                message: ["L'email et/ou le mot de passe est incorrect"]
            })
    } catch (e) {
        return400or500Errors(e, res)
    }
}

/*
 * POST /api/auth/register
 * Allows to create account
 */
export const register = async (req: Request, res: Response, _: NextFunction) => {
    try {
        await userService.createUser(req.body)

        res.status(200).send({
            status: "success",
            message: "User created."
        })
    } catch (e) {
        return400or500Errors(e, res)
    }
};


export const logout = async (req: Request, res: Response, _: NextFunction) => {
    try {
        await jwtService.removeJwtToken(req.user._id)

        res.status(200).send({
            status: "success",
            message: "You're logged out."
        });
    } catch (error) {
        return400or500Errors(error, res)
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        if (req.user) {
            res.json(req.user.set("local.password", null));
        } else {
            res.status(404).send({
                field: ["error"],
                message: ["User not Found"]
            });
        }
    } catch (error) {
        return400or500Errors(error, res)
    }
};


export const createDefaultAccountWithBotanistRight = async () => {
    try {
        const body = {
            "username": "defaultBotanist",
            "firstname": "John",
            "lastname": "doe",
            "email": "botanist@email.fr",
            "password": "123456"
        };
        const role = await getBotanistRole();
        await createUser(body, role)
    } catch (e) {
        throw(e)
    }
};