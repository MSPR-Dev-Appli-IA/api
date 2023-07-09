
import { NextFunction, Request, Response } from "express";
import {
    findPlantSittingsNotTakenAndNotBegin,
    findOnePlantSitting,
    deletePlantSittingWithPlantSittingId
} from "../queries/plantSitting.queries";
import {plantSittingValidation, updateplantSittingValidation} from "../database/validation/plantSitting.validation";
import mongoose from 'mongoose';
import {API_HOSTNAME, API_VERSION, return400or500Errors} from "../utils";
import {plantSittingService} from "../services/plantSittingService";
import {findOnePlant} from "../queries/plant.queries";

const PlantSittingService = new plantSittingService()

export const getPlantSitting = async (req: Request, res: Response, __: NextFunction) => {
    try {
        const search = (req.query.search) ? String(req.query.search) : ""
        const order = (req.query.order == "ASC") ? 1 : -1
        const result: any[] = []

        const plantSitting = await findPlantSittingsNotTakenAndNotBegin(order, search)

        await Promise.all(plantSitting.map(async (item) => {
            if(item.plant){
                const plantInfo = await findOnePlant(item.plant._id.toString())
                result.push({
                    _id: item._id,
                    description: item.description,
                    start: item.start_at,
                    end: item.end_at,
                    address: {
                        district: item.address.district,
                        x: item.address.location.x,
                        y: item.address.location.y
                    },
                    plantInfo: {
                        _id: plantInfo._id,
                        name: plantInfo.name,
                        images: plantInfo.images,
                        species : plantInfo.species
                    }
                })
            }

        }))
        res.status(200).send({
            "result": result
        });

    } catch (e) {
        return400or500Errors(e, res)
    }
};


export const getOnePlantSitting = async (req: Request, res: Response, __: NextFunction) => {
    try {
        const plantSittingId = req.params.plantSittingId;
        const plantSitting = await findOnePlantSitting(plantSittingId)
        if (plantSitting) {
            res.status(200).send({
                _id: plantSitting._id,
                plantInfo: plantSitting.plant,
                description: plantSitting.description,
                start_at: plantSitting.start_at,
                end_at: plantSitting.end_at,
                address: {
                    district: plantSitting.address.district,
                    x: plantSitting.address.location.x,
                    y: plantSitting.address.location.y
                },
            });
        } else {
            res.status(404).send({
                "field": ["error"],
                "message": ["Plant Sitting not found"]
            });
        }
    } catch (e) {
        return400or500Errors(e, res)
    }


};
export const newPlantSitting = async (req: Request, res: Response, __: NextFunction) => {
    try {
        await plantSittingValidation.validateAsync(req.body, {abortEarly: false});

        if (await PlantSittingService.create(req)) {
            res.status(200).send({
                "status": "success",
                "plantSittingInfo": API_HOSTNAME + "/api" + API_VERSION + "/plantSitting/" + PlantSittingService.plantSittingInfo._id,
            });
        } else {
            res.status(404).send({
                "field": ["error"],
                "message": ["Plant not Found"]
            })
        }
    } catch (e) {
        return400or500Errors(e, res)
    }
};

export const updatePlantSitting = async (req: Request, res: Response, __: NextFunction) => {
    try {
        await updateplantSittingValidation.validateAsync(req.body, {abortEarly: false});

        if(await PlantSittingService.update(req)){
            res.status(200).send({
                "status": "success",
                "plantSittingInfo": API_HOSTNAME + "/api" + API_VERSION + "/plantSitting/" + PlantSittingService.plantSittingInfo._id,
            });
        }else{
            res.status(404).send({
                "field": ["error"],
                "message": ["Plant not Found"]
            });
        }

    } catch (e) {
        return400or500Errors(e, res)
    }
};

export const removePlantSitting = async (req: Request, res: Response, __: NextFunction) => {
    try {
        const plantSittingId = req.params.plantSittingId;
        const plantSitting = await findOnePlantSitting(plantSittingId)
        if (plantSitting) {
            await deletePlantSittingWithPlantSittingId(new mongoose.Types.ObjectId(plantSittingId.trim()))
            res.status(200).send({
                "type": "success",
                "message": "Plant Sitting deleted"
            })
        }
        else {
            res.status(404).send({
                "field": ["error"],
                "message": ["Plant Sitting not found"]
            });
        }
    } catch (e) {
        return400or500Errors(e, res)
    }
}

