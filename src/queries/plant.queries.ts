import { Plant } from "../database/models/plant.models";
import {Image} from "../database/models/image.model"
import { User } from "../database/models/user.model";
import {IPlant} from "../interfaces";
import { Types } from 'mongoose';



export const getOnePlantById = async (plantId:Types.ObjectId ) : Promise<IPlant|null> => {
    return await Plant.findOne({ _id: plantId }).populate({path:"images",model:Image}).populate({path:"user",model:User}).exec();
};



