import { NextFunction, Request, Response } from "express";
import {findPlantUser} from "../queries/plant.queries";
import {return400or500Errors} from "../utils";

export const areYouThePlantOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plantUser = await findPlantUser(req.user._id)
        if (plantUser) {
            if (req.user._id.equals(plantUser.user._id)) {
                next()
            } else {
                res.status(401).send({ message: "You are not allowed. Because you are not the owner of this plant." });
            }
        } else {
            res.status(400).send({
                "field": ["error"],
                "message": ["Please create plant before."]
            });
        }

    } catch (error) {
        return400or500Errors(error, res)
    }
};

