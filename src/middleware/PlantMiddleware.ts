import { NextFunction, Request, Response } from "express";
import { getOnePlantById } from "../queries/plant.queries";
import {return400or500Errors} from "../utils";

export const areyouThePlantOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plantId = (req.params.plantId) ? req.params.plantId : req.body.plantId
        const plant = await getOnePlantById(plantId)
        if (plant) {
            if (req.user._id.equals(plant.user._id)) {
                next()
            } else {
                res.status(401).send({ message: "You are not allowed. Because you are not the owner of this plant." });
            }
        } else {
            res.status(400).send({
                "field": ["error"],
                "message": ["Not plant found."]
            });
        }

    } catch (error) {
        return400or500Errors(error, res)
    }
};

