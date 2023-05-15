import { NextFunction, Request, Response } from "express";
import { getOnePlantById } from "../queries/plant.queries";
import mongoose from 'mongoose';

export const areyouThePlantOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plantId = req.params.plantId
        const plant = await getOnePlantById(new mongoose.Types.ObjectId(plantId.trim()))
        if (plant) {
            if (req.user._id.equals(plant.user._id)) {
                next()
            } else {
                res.status(404).send({ message: "Your are not allowed" });
            }
        } else {

            res.status(404).send({ message: "Erreurssss" });
        }

    } catch (error) {
        
        res.status(404).send({ message: error });
    }
};

