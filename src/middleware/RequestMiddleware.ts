import { NextFunction, Request, Response } from "express";
import { getOnePlantById } from "../queries/plant.queries";
import { getOneRequestById } from "../queries/request.queries"
import {getOnePlantSittingByRequestId} from "../queries/plantSitting.queries";
import {return400or500Errors} from "../utils";
import {HttpError} from "../utils/HttpError";

export const areyouTheRequestOwner= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = req.params.requestId
        const request = await getOneRequestById(requestId)
        if (req.user._id.equals(request.booker?._id)) {
            next()
            return ;
        }
        throw new HttpError(401, "Your are not allowed. Because you're not the request owner.")

    } catch (error) {
        return400or500Errors(error, res)
    }
};


export const areyouThePlantSittingOwnerOrTheBooker= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = req.body.requestId
        const request = await getOneRequestById(requestId)
        const plantSitting = await getOnePlantSittingByRequestId(requestId)
        const plant = await getOnePlantById(plantSitting.plant._id.toString())
        if (plant){
            if (req.user._id.equals(plant.user._id)||req.user._id.equals(request?.booker._id) ) {
                next()
            } else {
                res.status(401).send({ message: "Your are not allowed" });
            }
        }

    } catch (error) {
        return400or500Errors(error, res)
    }
};


export const isThisRequestTaken= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = req.body.requestId
        const request = await getOneRequestById(requestId)
        if (request.status == "Accepted") {
            next()
        } else {
            res.status(401).send({ message: "This request has not yet been accepted."});
        }

    } catch (error) {
        
       return400or500Errors(error, res)
    }
};
