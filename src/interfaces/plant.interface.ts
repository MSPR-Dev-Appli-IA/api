import { Document  } from "mongoose";
import { IImage,IUser,ISpecies } from "./";

export interface IPlant extends Document{
    images : IImage[]
    user : IUser,
    species :ISpecies
    created_at:Date
}



