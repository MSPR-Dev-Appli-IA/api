import { NextFunction, Request, Response } from "express";
import { getOnePlantById } from "../queries/plant.queries";
import mongoose from 'mongoose';

export const areyouThePlantOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plantId = req.params.plantId
        const plant = await getOnePlantById(new mongoose.Types.ObjectId(plantId.trim()))
        if (plant) {
            console.log(req.user)
            console.log(plant.user)
            console.log(req.user._id,"dant la requeueueue")
            console.log(plant.user._id,"hooororor")
            if (req.user._id.equals(plant.user._id)) {
                console.log("passe ton icicicic")
                next()
            } else {
                console.log("pappapapapapap pkpkpkp")
                res.status(404).send({ message: "Your are not allowed" });
            }
        } else {

            res.status(404).send({ message: "Erreur" });
        }

    } catch (error) {
        res.status(404).send({ message: "Erreur" });
    }
};

