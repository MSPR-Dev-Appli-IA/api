import { NextFunction, Request, Response } from "express";
import { getOnePlantSittingById } from "../queries/plantSitting.queries";
import { getOnePlantById } from "../queries/plant.queries";
import { getOneRequestById } from "../queries/request.queries";
import {return400or500Errors} from "../utils";
import {IPlant, IPlantSitting, IRequest} from "../interfaces";
import {HttpError} from "../utils/HttpError";

export class PlantSittingMiddleware{
    public _plantSittingInfo: IPlantSitting;
    public _plantInfo: IPlant;
    public _requestInfo?: IRequest;

    public static async build(plantSittingId: string, requestId?: string) {
        const plantSittingInfo = await getOnePlantSittingById(plantSittingId)

        if(requestId){
            return new PlantSittingMiddleware(
                plantSittingInfo, await getOnePlantById(plantSittingInfo.plant._id.toString()), await getOneRequestById(requestId)
            )
        }

        return new PlantSittingMiddleware(
            plantSittingInfo, await getOnePlantById(plantSittingInfo.plant._id.toString())
        )
    }

    constructor(plantSittingInfo : IPlantSitting, plantInfo: IPlant, requestInfo? :IRequest) {
        this._plantSittingInfo = plantSittingInfo
        this._plantInfo = plantInfo
        if(requestInfo){
            this._requestInfo = requestInfo
        }
    }

}

export const areyouThePlantSittingOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myPlantSittingMiddleware = await PlantSittingMiddleware.build(req.body.plantSittingId)

        if(myPlantSittingMiddleware._plantSittingInfo && myPlantSittingMiddleware._plantInfo && req.user._id.equals(myPlantSittingMiddleware._plantInfo.user._id)){
            next()
        }

        throw new HttpError(401, "This plant doesn't belong to you.")

    } catch (error) {
        return400or500Errors(error, res)
    }
};



export const areyouThePlantSittingOwnerFromTheRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myPlantSittingMiddleware = await PlantSittingMiddleware.build(req.body.plantSittingId, req.body.requestId)

        if(myPlantSittingMiddleware._requestInfo && myPlantSittingMiddleware._plantSittingInfo && req.user._id.equals(myPlantSittingMiddleware._plantInfo.user._id)){
            next()
        }

        throw new HttpError(401, "You are not authorized to access this conversation. Because you aren't the plant sitting owner.")

    } catch (error) {
        return400or500Errors(error, res)
    }
};

export const areThePlantSittingStillAvailable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myPlantSittingMiddleware = await PlantSittingMiddleware.build(req.body.plantSittingId)

        if (!myPlantSittingMiddleware._plantSittingInfo.is_taken && Date.now() < myPlantSittingMiddleware._plantSittingInfo.start_at.getDate() ){
            next()
        }
        throw new HttpError(401, "This plant sitting are not available.")

    } catch (error) {
        return400or500Errors(error, res);
    }
};

export const areThePlantSittingStillAvailableFromTheRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = req.body.requestId
        const request = await getOneRequestById(requestId.trim())
        if (request && !request.plantSitting.is_taken && Date.now() < request.plantSitting.start_at.getDate()) {
                next()
        } else {
            throw new HttpError(401, "This plant sitting are not available from this request.")
        }

    } catch (error) {
        return400or500Errors(error, res)
    }
};
