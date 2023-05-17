import { NextFunction, Request, Response } from "express";
import { getOnePlantById } from "../queries/plant.queries";
import mongoose from 'mongoose';
import { getOneConversationById } from "../queries/conversation.queries";
import { getOnePlantSittingById } from "../queries/plantSitting.queries";

export const areyouTheConversationOwner= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversationId = req.params.conversationId
        const conversation = await getOneConversationById(new mongoose.Types.ObjectId(conversationId.trim()))
        if (conversation) {
            if (req.user._id.equals(conversation.booker?._id)) {
                next()
            } else {
                res.status(404).send({ message: "Your are not allowed" });
            }
        } else {
            res.status(404).send({ message: "Erreurs" });
        }

    } catch (error) {
        
        res.status(404).send({ message: error });
    }
};


export const areyouThePlantSittingOwnerOrTheBooker= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversationId = req.params.conversationId
        const conversation = await getOneConversationById(new mongoose.Types.ObjectId(conversationId.trim()))
        const plantSitting = await getOnePlantSittingById(new mongoose.Types.ObjectId(conversation?.plantSitting._id))
        if (plantSitting) {
            const plant = await getOnePlantById(plantSitting.plant._id)
            if (plant){
                if (req.user._id.equals(plant.user._id)||req.user._id.equals(conversation?.booker._id) ) {
                    next()
                } else {
                    res.status(404).send({ message: "Your are not allowed" });
                }
            }
           
        } else {

            res.status(404).send({ message: "Erreur" });
        }

    } catch (error) {
        
        res.status(404).send({ message: error });
    }
};

