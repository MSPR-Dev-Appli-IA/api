import { Document  } from "mongoose";
import { IImage,IUser,ISpecies } from "./";

export interface IPlant extends Document{
    name : String
    images : IImage[]
    user : IUser,
    species :ISpecies
    created_at:Date
}

export interface PlantForm {
    name : String,
    speciesId: String
}







