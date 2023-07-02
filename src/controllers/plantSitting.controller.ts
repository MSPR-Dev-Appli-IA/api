
import { NextFunction, Request, Response } from "express";
import {
    findPlantSittingsNotTakenAndNotBegin,
    findOnePlantSitting,
    deletePlantSittingWithPlantSittingId,
    createPlantSitting
} from "../queries/plantSitting.queries";
import { plantSittingValidation } from "../database/validation/plantSitting.validation";
import mongoose from 'mongoose';
import {API_HOSTNAME, API_VERSION, return400or500Errors} from "../utils";
import {findOnePlant} from "../queries/plant.queries";
import {addressService} from "../services/addressService";

const AddressService = new addressService()

export const getPlantSitting = async (req: Request, res: Response, __: NextFunction) => {
    try {
        const search = (req.query.search) ? String(req.query.search) : ""
        const order = (req.query.order == "ASC") ? 1 : -1
        const result: any[] = []

        const plantSitting = await findPlantSittingsNotTakenAndNotBegin(order, search)

        plantSitting.forEach(item => {
            if(item.plant){
                result.push({
                    _id: item._id,
                    address: {
                        x: item.address.location.x,
                        y: item.address.location.y
                    },
                    plantInfo: item.plant
                })
            }else{
                throw new Error("Impossible to obtain plant name with this search name")
            }
        })
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
export const newPlantSitting = async (req: Request, res: Response, __: NextFunction) => {

    try {
        const plantId: string = req.body.plantId

        await plantSittingValidation.validateAsync(req.body, { abortEarly: false });

        const plantInfo = await findOnePlant(plantId)

        if(plantInfo){
            req.body.address = await AddressService.getOrCreateAddress(req.body.address)
            req.body.plant = plantInfo
            const newPlantSitting = await createPlantSitting(req.body)
            res.status(200).send({
                "status": "success",
                "plantSittingInfo": API_HOSTNAME + "/api" + API_VERSION + "/plantSitting/" + newPlantSitting._id,
            });
        }else{
            res.status(404).send({
                "field": ["error"],
                "message": ["Plant not Found"]
            })
        }
      } catch (e) {
        return400or500Errors(e, res)
      }

};

export const updatePlantSitting = async (_req: Request, _res: Response, __: NextFunction) => {

    // try {
    //     await plantSittingValidation.validateAsync(req.body, { abortEarly: false });
    //     const plantSittingId = req.params.plantSittingId;
    //     let { title,description,start_at,end_at,address} = req.body
    //     const addressObject = await getAddressFromLabel(address)
    //     if (addressObject){
    //       const newPlantSitting = await updatePlantSittingWithPlantSittingsId(new  mongoose.Types.ObjectId(plantSittingId.trim()),title,description,start_at,end_at,addressObject)
    //       res.status(200).json(newPlantSitting);
    //     }else{
    //         res.status(404).send({ message: "Cette addresse n'existe pas " });
    //     }
    //
    //   } catch (e) {
    //     const errors = [];
    //     if (e instanceof ValidationError) {
    //       e.details.map((error) => {
    //         errors.push({ field: error.path[0], message: error.message });
    //       });
    //     }else {
    //       errors.push({ field: "error", message: "Erreur" })
    //   }
    //     res.status(404).send({  errors });
    //   }

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

