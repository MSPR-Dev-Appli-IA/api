import { Document  } from "mongoose";
import { Types } from 'mongoose';

export interface IPlantSitting extends Document{
    title : string
    description : string
    created_at:Date
    start_at :Date
    end_at :Date
    is_taken : Boolean
    plant: Types.ObjectId
    address:Types.ObjectId
}


export interface PlantSittingForm{
    title : string
    description : string
    start_at :Date
    end_at :Date
    address:string
}
