import { NextFunction, Request, Response } from "express";
import { getOnePlantSittingById } from "../queries/plantSitting.queries";
import { getOnePlantById } from "../queries/plant.queries";
import mongoose from 'mongoose';

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

