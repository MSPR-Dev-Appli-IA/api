import { Document  } from "mongoose";
import { IImage,IUser,ISpecies,IPlantSitting } from "./";
import { IAdvice } from "./advice.interface";

export interface IPlant extends Document{
    name : String
    images : IImage[]
    user : IUser,
    species :ISpecies
    created_at:Date
    plantSittings : IPlantSitting[]
    advices : IAdvice[]
}

export interface PlantForm {
    plantId: String
    name : String,
    speciesId: String
}







