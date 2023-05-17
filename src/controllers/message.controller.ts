
import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import { getOneConversationById } from "../queries/conversation.queries";
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
        const conversationId = req.params.conversationId;
        const conversation = await getOneConversationById(new mongoose.Types.ObjectId(conversationId.trim()))
        if (conversation) {
       
            const newMessage = await createMessage(null, req.user, conversation,content)
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
        const conversationId = req.params.conversationId;
        const conversation = await getOneConversationById(new mongoose.Types.ObjectId(conversationId.trim()))
        if (file && conversation) {
            const imageMessage = await newImage(file)
            const newMessage = await createMessage(imageMessage, req.user, conversation)
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


