import { PlantSitting } from "../database/models/plantSitting.model";
import { Plant } from "../database/models/plant.models";
import { Types } from 'mongoose';
import { IPlantSitting } from "../interfaces";
import { Address } from "../database/models/adress.model";



export const getOnePlantSittingById = async (plantSittingId: Types.ObjectId): Promise<IPlantSitting | null> => {
    return await PlantSitting.findOne({ _id: plantSittingId }).populate({ path: "plant", model: Plant }).populate({ path: "address", model: Address }).exec();
};

export const findPlantSittingsNotTakenAndNotBegin = async () => {
    const d =new Date();
    return await PlantSitting.find({
        start_at: {$gte: d.getTime()},
        is_taken: false

    })
    .populate({ path: "plant", model: Plant })
    .populate({ path: "address", model: Address })
    .exec()
};

export const findOnePlantSitting = async (plantSittingId: Types.ObjectId) => {
    return PlantSitting.findOne({ _id: plantSittingId })
    .populate({ path: "plant", model: Plant })
    .populate({ path: "address", model: Address })
    .exec()
};
