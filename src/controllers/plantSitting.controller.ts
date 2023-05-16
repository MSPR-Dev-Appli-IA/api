
import { NextFunction, Request, Response } from "express";
import { findPlantSittingsNotTakenAndNotBegin } from "../queries/plantSitting.queries";


export const getPlantSitting = async (_: Request, res: Response, __: NextFunction) => {
    try {
        const plantSitting = await findPlantSittingsNotTakenAndNotBegin()
        res.status(200).json( plantSitting );
      } catch (e) {
        res.status(404).send({ message: "Error" });
      }
};


export const getOnePlantSitting = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Erreur" });

};
export const newPlantSitting = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Erreur" });

};

export const updatePlantSitting = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Erreur" });

};

export const removePlantSitting = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Erreur" });

};

