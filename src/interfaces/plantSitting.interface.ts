import { Document  } from "mongoose";
import { Types } from 'mongoose';
import {IAddress} from "./address.interface";

export interface IPlantSitting extends Document{
    plant: Types.ObjectId
    description : string
    created_at: Date
    start_at : Date
    end_at : Date
    is_taken : Boolean

    address: IAddress
}
