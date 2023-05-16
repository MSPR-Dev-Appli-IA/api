
import { NextFunction, Request, Response } from "express";
import { findPlantSittingsNotTakenAndNotBegin, findOnePlantSitting, deletePlantSittingWithPlantSittingId } from "../queries/plantSitting.queries";
import mongoose from 'mongoose';

export const getPlantSitting = async (_: Request, res: Response, __: NextFunction) => {
    try {
        const plantSitting = await findPlantSittingsNotTakenAndNotBegin()
        res.status(200).json(plantSitting);
    } catch (e) {
        res.status(404).send({ message: "Error" });
    }
};


export const getOnePlantSitting = async (req: Request, res: Response, __: NextFunction) => {
    try {
        const plantSittingId = req.params.plantSittingId;
        const plantSitting = await findOnePlantSitting(new mongoose.Types.ObjectId(plantSittingId.trim()))
        if (plantSitting) {
            res.status(200).json(plantSitting);
        } else {
            res.status(404).send({ message: "Ce gardiennage de plante  n'existe pas" });
        }
    } catch (e) {
        res.status(404).send({ message: "Erreur" });
    }


};
export const newPlantSitting = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Erreur" });

};

export const updatePlantSitting = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Erreur" });

};

export const removePlantSitting = async (req: Request, res: Response, __: NextFunction) => {
    try {
        const plantSittingId = req.params.plantSittingId;
        const plantSitting = await findOnePlantSitting(new mongoose.Types.ObjectId(plantSittingId.trim()))
        if (plantSitting) {
            await deletePlantSittingWithPlantSittingId(new mongoose.Types.ObjectId(plantSittingId.trim()))
            res.status(200).send()
        }
        else {
            res.status(404).send("Cet plante n'existe pas  n'existe pas");
        }

    } catch (e) {
        res.status(404).send("error");

    }
}

