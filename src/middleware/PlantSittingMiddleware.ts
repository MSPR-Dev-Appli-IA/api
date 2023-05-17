import { NextFunction, Request, Response } from "express";
import { getOnePlantSittingById } from "../queries/plantSitting.queries";
import { getOnePlantById } from "../queries/plant.queries";
import mongoose from 'mongoose';
import { getOneConversationById } from "../queries/conversation.queries";

export const areyouThePlantSittingOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plantSittingId = req.params.plantSittingId
        const plantSitting = await getOnePlantSittingById(new mongoose.Types.ObjectId(plantSittingId.trim()))
        if (plantSitting ) {
            const plant = await getOnePlantById(plantSitting?.plant._id)
            if (plant){
                if (req.user._id.equals(plant.user._id)) {
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



export const areyouThePlantSittingOwnerFromTheConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversationId = req.params.conversationId
        const conversation = await getOneConversationById(new mongoose.Types.ObjectId(conversationId.trim()))
        const plantSitting = await getOnePlantSittingById(new mongoose.Types.ObjectId(conversation?.plantSitting._id))
        if (plantSitting) {
            const plant = await getOnePlantById(plantSitting.plant._id)
            if (plant){
                if (req.user._id.equals(plant.user._id)) {
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

export const areThePlantSittingStillAvailable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plantSittingId = req.params.plantSittingId
        const plantSitting = await getOnePlantSittingById(new mongoose.Types.ObjectId(plantSittingId.trim()))
        if (plantSitting  ) {
            if (!plantSitting.is_taken && Date.now() < plantSitting.start_at.getDate() ){
                next()
            }else{
                res.status(404).send({ message: "Erreur" });
            }
            
           
        } else {

            res.status(404).send({ message: "Erreur" });
        }

    } catch (error) {
        
        res.status(404).send({ message: error });
    }
};

export const areThePlantSittingStillAvailableFromTheConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversationId = req.params.conversationId
        const conversation = await getOneConversationById(new mongoose.Types.ObjectId(conversationId.trim()))
        if (conversation ) {
            if (!conversation.plantSitting.is_taken && Date.now() < conversation.plantSitting.start_at.getDate() ){
                next()
            }else{
                res.status(404).send({ message: "Erreur" });
            }
            
           
        } else {

            res.status(404).send({ message: "Erreur" });
        }

    } catch (error) {
        
        res.status(404).send({ message: error });
    }
};
