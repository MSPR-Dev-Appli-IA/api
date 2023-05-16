import { PlantSitting } from "../database/models/plantSitting.model";
import { Plant } from "../database/models/plant.models";
import { Types } from 'mongoose';
import { IPlantSitting } from "../interfaces";



export const getOnePlantSittingById = async (plantSittingId: Types.ObjectId): Promise<IPlantSitting | null> => {
    return await PlantSitting.findOne({ _id: plantSittingId }).populate({ path: "plant", model: Plant }).exec();
};

