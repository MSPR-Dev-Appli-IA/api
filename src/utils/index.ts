import {Response} from "express";
import {ValidationError} from "joi";
import {HttpError} from "./HttpError";
import {JwtError} from "./services/jwtService";
import {NODE_ENV} from "../environments/env";

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
        return;
    }else if(error instanceof JwtError){
        res.status(401).send({
            field: ["error"],
            message: [error.message]
        })
        return ;
    }else if (error instanceof HttpError){
        res.status(error.statusCode).send({
            "field": ["error"],
            "message": [error.getErrorMessage()]
        })
        return ;
    }
    else if(error.stack.split(': ')[0] == "MongoServerError"){
        if(error.message.indexOf('duplicate key error') !== -1){
            res.status(400).send({
                field: ["error"],
                message: ["Duplicate key error."]
            });
            return ;
        }
    }else if(NODE_ENV === "dev"){
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

export {return400or500Errors};