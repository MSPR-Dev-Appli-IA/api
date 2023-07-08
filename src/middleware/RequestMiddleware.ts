import { NextFunction, Request, Response } from "express";
import { getOnePlantById } from "../queries/plant.queries";
import mongoose from 'mongoose';
import { getOneRequestById } from "../queries/request.queries"
import { getOnePlantSittingById } from "../queries/plantSitting.queries";

export const areyouTheRequestOwner= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = req.params.requestId
        const request = await getOneRequestById(new mongoose.Types.ObjectId(requestId.trim()))
        if (request) {
            if (req.user._id.equals(request.booker?._id)) {
                next()
            } else {
                res.status(404).send({ message: "Your are not allowed" });
            }
        } else {
            res.status(404).send({ message: "Erreurs" });
        }

    } catch (error) {
        
        res.status(404).send({ message: error });
    }
};


export const areyouThePlantSittingOwnerOrTheBooker= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = req.params.requestId
        const request = await getOneRequestById(new mongoose.Types.ObjectId(requestId.trim()))
        const plantSitting = await getOnePlantSittingById(new mongoose.Types.ObjectId(request?.plantSitting._id))
        if (plantSitting) {
            const plant = await getOnePlantById(plantSitting.plant._id.toString())
            if (plant){
                if (req.user._id.equals(plant.user._id)||req.user._id.equals(request?.booker._id) ) {
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


export const isThisRequestTaken= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = req.params.requestId
        const request = await getOneRequestById(new mongoose.Types.ObjectId(requestId.trim()))
        if (request) {
            if (request.status== "Accepté") {
                next()
            } else {
                res.status(404).send({ message: "Your are not allowed" });
            }
        } else {
            res.status(404).send({ message: "Erreurs" });
        }

    } catch (error) {
        
        res.status(404).send({ message: error });
    }
};

