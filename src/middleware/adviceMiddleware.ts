import { NextFunction, Request, Response } from "express";
import { getOnePlantById } from "../queries/plant.queries";
import mongoose from 'mongoose';
import { getOneAdviceById } from "../queries/advice.queries";
import { findUserPerId } from "../queries/user.queries";

export const AreYouBotanistOrOwnerAdvice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adviceId = req.params.adviceId
        const advice = await getOneAdviceById(new mongoose.Types.ObjectId(adviceId.trim()))
        if (advice) {
            const plant = await getOnePlantById(advice.plant._id)
            if (plant) {
                const user = await findUserPerId(plant?.user._id)
                if (req.user._id.equals(plant.user._id) || user?.role.name == "Botanist") {
                    next()
                } else {
                    res.status(404).send({ message: "Your are not allowed" });
                }
            } else {
                res.status(404).send({ message: "Erreurs" });
            }

        } else {

            res.status(404).send({ message: "Erreurs" });
        }

    } catch (error) {

        res.status(404).send({ message: error });
    }
};




export const areYouTheAdviceOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adviceId = req.params.adviceId
        const advice = await getOneAdviceById(new mongoose.Types.ObjectId(adviceId.trim()))
        if (advice) {
            const plant = await getOnePlantById(advice.plant._id)
            if (plant) {
                if (req.user._id.equals(plant.user._id)) {
                    next()
                } else {
                    res.status(404).send({ message: "Your are not allowed" });
                }
            } else {
                res.status(404).send({ message: "Erreurs" });
            }

        } else {

            res.status(404).send({ message: "Erreurs" });
        }

    } catch (error) {

        res.status(404).send({ message: error });
    }
};


export const notAlreadyTaken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adviceId = req.params.adviceId
        const advice = await getOneAdviceById(new mongoose.Types.ObjectId(adviceId.trim()))
        if (advice) {

            if (!advice.taked_by) {
                next()
            } else {
                res.status(404).send({ message: "Already taken" });
            }


        } else {

            res.status(404).send({ message: "Erreurs" });
        }

    } catch (error) {

        res.status(404).send({ message: error });
    }
};


