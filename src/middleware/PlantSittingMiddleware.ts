import {NextFunction, Request, Response} from "express";
import {return400or500Errors} from "../utils";
import {HttpError} from "../utils/HttpError";
import {findOnePlantSitting, getOnePlantSittingByRequestId} from "../queries/plantSitting.queries";
import {findOnePlant} from "../queries/plant.queries";


export const areyouThePlantSittingOwnerFromTheRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myPlantSittingInfo = await getOnePlantSittingByRequestId(req.body.requestId)
        const userInfo = await findOnePlant(myPlantSittingInfo.plant._id.toString())

        if (req.user._id.toString() == userInfo.user._id.toString()) {
            next()
            return;
        }

        throw new HttpError(401, "You are not authorized to access this conversation. Because you aren't the plant sitting owner.")

    } catch (error) {
        return400or500Errors(error, res)
    }
}

export const areThePlantSittingStillAvailable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plantSittingInfo = await findOnePlantSitting(req.body.plantSittingId)

        if (!plantSittingInfo.is_taken && Date.now() < plantSittingInfo.end_at.getTime()) {
            next()
            return;
        }
        throw new HttpError(401, "This plant sitting are not available. Because it's ended or already taken.")

    } catch (error) {
        return400or500Errors(error, res);
    }
}

export const areThePlantSittingStillAvailableFromTheRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plantSittingInfo = await getOnePlantSittingByRequestId(req.body.requestId)

        if (!plantSittingInfo.is_taken && Date.now() < plantSittingInfo.end_at.getTime()) {
            next()
            return;
        } else {
            throw new HttpError(401, "This plant sitting are not available from this request.")
        }

    } catch (error) {
        return400or500Errors(error, res)
    }
}