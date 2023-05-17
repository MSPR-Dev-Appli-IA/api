
import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import { getOneRequestById } from "../queries/request.queries";
import { newImage } from "./image.controller";
import { createMessage, deleteMessageWithMessageId, findMessageById } from "../queries/message.queries";
import { Types } from 'mongoose';
import { deleteImage } from "../queries/image.queries";
import  { ValidationError } from "joi";
import * as fs from 'fs';
import { messageValidation } from "../database/validation/message.validation";

export const postContentMessage = async (req: Request, res: Response, __: NextFunction) => {

    try {
        await messageValidation.validateAsync(req.body, { abortEarly: false });
        const {content} = req.body
        const requestId = req.params.requestId;
        const request = await getOneRequestById(new mongoose.Types.ObjectId(requestId.trim()))
        if (request) {
       
            const newMessage = await createMessage(null, req.user, request,content)
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


export const postImageMessage = async (req: Request, res: Response, __: NextFunction) => {

    try {

        const file = req.file as Express.Multer.File
        const requestId = req.params.requestId;
        const request = await getOneRequestById(new mongoose.Types.ObjectId(requestId.trim()))
        if (file && request) {
            const imageMessage = await newImage(file)
            const newMessage = await createMessage(imageMessage, req.user, request)
            res.status(200).send(newMessage);
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


