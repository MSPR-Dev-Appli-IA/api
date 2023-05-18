import {Response} from "express";
import {ValidationError} from "joi";

const API_HOSTNAME = (process.env.API_HOSTNAME) ? process.env.API_HOSTNAME : ""
const API_VERSION = (process.env.API_VERSION) ? process.env.API_VERSION : ""

function return400or500Errors(error: any, res: Response) {
    const field: any[] = [];
    const message: any[] = [];
    if (error instanceof ValidationError) {
        error.details.forEach(item => {
            field.push(item.path[0])
            message.push(item.message)
        });

        res.status(400).send({
            field: field,
            message: message
        });
    } else {
        res.status(500).send({
            field: ["error"],
            message: ["An error was occurred. Please contact us"]
        });
    }
}

export {API_HOSTNAME, API_VERSION, return400or500Errors};