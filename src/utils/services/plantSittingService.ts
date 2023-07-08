
import {Request} from "express";
import {addressService} from "./addressService";
import {findOnePlant} from "../../queries/plant.queries";
import {
    createPlantSitting, PlantSittingQueries,
    updatePlantSittingWithPlantSittingsId
} from "../../queries/plantSitting.queries";
import {HttpError} from "../HttpError";

const AddressService = new addressService()

export class PlantSittingService {
    public plantSittingInfo: any;
    private plantSittingRepository: PlantSittingQueries;

    constructor() {
        this.plantSittingRepository = new PlantSittingQueries()
    }

    async create(req: Request) {
        const plantInfo = await findOnePlant(req.body.plantId)

        req.body.address = await AddressService.getOrCreateAddress(req.body.address)
        req.body.plant = plantInfo

        return await createPlantSitting(req.body)
    }

    async update(req: Request) {
        const plantSitting = await this.plantSittingRepository.findById(req.body.plantSittingId)

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