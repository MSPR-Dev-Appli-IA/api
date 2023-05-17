
import { NextFunction, Request, Response } from "express";
import { findLimitedAdvicesFoOnePlant, findLimitedAdvicesNotTaken,findLimitedAdvicesOfBotanist,getOneAdviceById  } from "../queries/advice.queries";
import mongoose from 'mongoose';
const limit = 5

export const getAdvicesNotTaken = async (req: Request, res: Response, __: NextFunction) => {

    try {
        let { page = 1, order } = req.body;
        order = order == "ASC" ? 1 : -1
        const skip: number = limit * page - limit;
        const advices = await findLimitedAdvicesNotTaken(limit, skip, order)
        res.status(200).json(advices);
    } catch (e) {
        res.status(404).send({ message: "Error" });
    }
};


export const getMyAdvicesForOnePlant = async (req: Request, res: Response, __: NextFunction) => {

    try {
        let { page = 1, order } = req.body;
        const plantId = req.params.plantId
        order = order == "ASC" ? 1 : -1
        const skip: number = limit * page - limit;
        const advices = await findLimitedAdvicesFoOnePlant(limit, skip, order, new mongoose.Types.ObjectId(plantId.trim()))
        res.status(200).json(advices);
    } catch (e) {
        res.status(404).send({ message: "Error" });
    }

};

export const getMyAdvicesBotanist = async (req: Request, res: Response, __: NextFunction) => {
    try {
        let { page = 1, order } = req.body;

        order = order == "ASC" ? 1 : -1
        const skip: number = limit * page - limit;
        const advices = await findLimitedAdvicesOfBotanist(limit, skip, order, req.user._id)
        res.status(200).json(advices);
    } catch (e) {
        res.status(404).send({ message: "Error" });
    }


};
export const getOneAdvice = async (req: Request, res: Response, __: NextFunction) => {

    try {
        const adviceId = req.params.adviceId
        const advice = await getOneAdviceById (new mongoose.Types.ObjectId(adviceId.trim()))
        res.status(200).json(advice);
    } catch (e) {
        res.status(404).send({ message: "Error" });
    }

};

export const createAdvice = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Error" });

};

export const takeOneAdvice = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Error" });

};
export const removeAdvice = async (_: Request, res: Response, __: NextFunction) => {

    res.status(404).send({ message: "Error" });

};