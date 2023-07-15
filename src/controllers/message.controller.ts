import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import { newImage } from "./image.controller";
import { Types } from 'mongoose';
import  { ValidationError } from "joi";
import * as fs from 'fs';
import { messageValidation } from "../database/validation/message.validation";
import {getOneRequestById} from "../queries/request.queries";
import {
    createMessageForAdvice,
    deleteMessageWithMessageId,
    findMessageById
} from "../queries/message.queries";
import {getOneAdviceById} from "../queries/advice.queries";
import {deleteImage} from "../queries/image.queries";
import {return400or500Errors} from "../utils";

export const sendMessage = async (_req: Request, res: Response, __: NextFunction) => {
    try{

    }catch (e) {
        return400or500Errors(e, res)
    }
}

export const postContentMessageForRequest = async (req: Request, res: Response, __: NextFunction) => {

    try {
        await messageValidation.validateAsync(req.body, { abortEarly: false });
        const requestId = req.params.requestId;
        const request = await getOneRequestById(requestId)
        if (request) {
       
            // const newMessage = await createMessageForRequest(null, req.user, request, req.body)
            // res.status(200).send(newMessage);
            res.status(200).send();
        } else {
            res.status(404).send("Error");
        }
    } catch (e) {
        const errors = [];
        if (e instanceof ValidationError) {
          e.details.map((error) => {
            errors.push({ field: error.path[0], message: error.message });
          });
        } else {
          errors.push({ field: "error", message: "Erreur" })
        }
        res.status(404).send({ errors });
      }

};


export const postImageMessageForRequest = async (req: Request, res: Response, __: NextFunction) => {

    try {

        const file = req.file as Express.Multer.File
        const requestId = req.params.requestId;
        const request = await getOneRequestById(requestId)
        if (file && request) {
            // const imageMessage = await newImage(file)
            // const newMessage = await createMessageForRequest(imageMessage, req.user, request)
            // res.status(200).send(newMessage);
            res.status(200).send();
        } else {
            res.status(404).send("Error");
        }
    } catch (e) {
        res.status(404).send("error");
    }

};


export const deleteMessage = async (messageId: Types.ObjectId) => {

    try {
        const message = await findMessageById(messageId)
        if (message ) {
            if (message.image){
                fs.unlinkSync("public/image/" + message.image.path);
                await deleteImage(message.image._id)
            }
            await deleteMessageWithMessageId(messageId)
           
        }
    } catch (e) {
        throw e
    }

};

export const postImageMessageForAdvice = async (req: Request, res: Response, __: NextFunction) => {

    try {

        const file = req.file as Express.Multer.File
        const adviceId = req.params.adviceId;
        const advice = await getOneAdviceById(new mongoose.Types.ObjectId(adviceId.trim()))
        if (file && advice) {
            const imageMessage = await newImage(file)
            const newMessage = await createMessageForAdvice(imageMessage, req.user, advice)
            res.status(200).send(newMessage);
        } else {
            res.status(404).send("Error");
        }
    } catch (e) {
        res.status(404).send("error");
    }


};

export const postContentMessageForAdvice = async (req: Request, res: Response, __: NextFunction) => {

    try {
        await messageValidation.validateAsync(req.body, { abortEarly: false });
        const {content} = req.body
        const adviceId = req.params.adviceId;
        const advice = await getOneAdviceById(new mongoose.Types.ObjectId(adviceId.trim()))
        if (advice) {
            const newMessage = await createMessageForAdvice(null, req.user, advice,content)
            res.status(200).send(newMessage);
        } else {
            res.status(404).send("Error");
        }
    } catch (e) {
        const errors = [];
        if (e instanceof ValidationError) {
          e.details.map((error) => {
            errors.push({ field: error.path[0], message: error.message });
          });
        } else {
          errors.push({ field: "error", message: "Erreur" })
        }
        res.status(404).send({ errors });
      }

};


