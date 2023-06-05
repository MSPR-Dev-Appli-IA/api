import {Response} from "express";
import {ValidationError} from "joi";

const API_HOSTNAME = (process.env.API_HOSTNAME) ? process.env.API_HOSTNAME : ""
const API_VERSION = (process.env.API_VERSION) ? process.env.API_VERSION : ""
const JWT_TIME = (process.env.JWT_TIME) ? process.env.JWT_TIME : 60*15

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
        return ;
    }else if(error.stack.split(': ')[0] == "MongoServerError"){
        if(error.message.indexOf('duplicate key error') !== -1){
            res.status(400).send({
                field: ["error"],
                message: ["Duplicate key error."]
            });
            return ;
        }
    }else if(process.env.NODE_ENV === "dev"){
        res.status(500).send({
            field: ["error"],
            message: {
                stack: error.stack,
                message: error.message
            }
        });
        return ;
    } else {
        res.status(500).send({
            field: ["error"],
            message: ["An error was occurred. Please contact us"]
        });
        return ;
    }
}

export {API_HOSTNAME, API_VERSION, JWT_TIME, return400or500Errors};