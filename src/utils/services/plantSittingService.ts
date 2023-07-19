
import {Request} from "express";
import {addressService} from "./addressService";
import {findOnePlant} from "../../queries/plant.queries";
import {
    createPlantSitting, getOnePlantSittingById,
    updatePlantSittingWithPlantSittingsId
} from "../../queries/plantSitting.queries";
import {HttpError} from "../HttpError";

const AddressService = new addressService()

export class PlantSittingService {

    async create(req: Request) {
        const plantInfo = await findOnePlant(req.body.plantId)

        req.body.address = await AddressService.getOrCreateAddress(req.body.address)
        req.body.plant = plantInfo

        return await createPlantSitting(req.body)
    }

    async update(req: Request) {
        const plantSitting = await getOnePlantSittingById(req.body.plantSittingId)

        req.body._id = plantSitting._id
        req.body.plant = await findOnePlant(req.body.plantId)
        req.body.address = await AddressService.getOrCreateAddress(req.body.address)
        const newPlantSitting = await updatePlantSittingWithPlantSittingsId(req.body)
        if (newPlantSitting) {
            return newPlantSitting
        }
        throw new HttpError(500, 'An error was occurred when call updatePlantSittingWithPlantSittingsId method')
    }
}