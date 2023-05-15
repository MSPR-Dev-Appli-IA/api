import { Document  } from "mongoose";
import { IImage,IUser,ISpecies,IPlantSitting } from "./";

export interface IPlant extends Document{
    name : String
    images : IImage[]
    user : IUser,
    species :ISpecies
    created_at:Date
    plantSittings : IPlantSitting[]
}

export interface PlantForm {
    plantId: String
    name : String,
    speciesId: String
}







