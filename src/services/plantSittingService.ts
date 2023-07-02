import {findOnePlant} from "../queries/plant.queries";
import {Request} from "express";
import {
    createPlantSitting,
    findOnePlantSitting,
    updatePlantSittingWithPlantSittingsId
} from "../queries/plantSitting.queries";
import {addressService} from "./addressService";

const AddressService = new addressService()
export class plantSittingService{
    public plantSittingInfo: any;
    async create(req: Request){
        const plantInfo = await findOnePlant(req.body.plantId)

        req.body.address = await AddressService.getOrCreateAddress(req.body.address)
        req.body.plant = plantInfo
        this.plantSittingInfo = await createPlantSitting(req.body)
        return true

    }

    async update(req: Request){
        const plantSitting = await findOnePlantSitting(req.body.plantSittingId)

        if (plantSitting) {
            req.body._id = plantSitting._id
            req.body.plant = await findOnePlant(req.body.plantId)
            req.body.address = await AddressService.getOrCreateAddress(req.body.address)
            const newPlantSitting = await updatePlantSittingWithPlantSittingsId(req.body)
            if(newPlantSitting){
                this.plantSittingInfo = newPlantSitting
                return true
            }else{
                throw new Error('An error was occurred when call updatePlantSittingWithPlantSittingsId method')
            }
        } else {
            return false
        }
    }
}