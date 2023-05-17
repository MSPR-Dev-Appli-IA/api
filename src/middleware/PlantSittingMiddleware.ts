import { NextFunction, Request, Response } from "express";
import { getOnePlantSittingById } from "../queries/plantSitting.queries";
import { getOnePlantById } from "../queries/plant.queries";
import mongoose from 'mongoose';
import { getOneRequestById } from "../queries/request.queries";

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



export const areyouThePlantSittingOwnerFromTheRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = req.params.requestId
        const request = await getOneRequestById(new mongoose.Types.ObjectId(requestId.trim()))
        const plantSitting = await getOnePlantSittingById(new mongoose.Types.ObjectId(request?.plantSitting._id))
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

export const areThePlantSittingStillAvailableFromTheRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = req.params.requestId
        const request = await getOneRequestById(new mongoose.Types.ObjectId(requestId.trim()))
        if (request ) {
            if (!request.plantSitting.is_taken && Date.now() < request.plantSitting.start_at.getDate() ){
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
