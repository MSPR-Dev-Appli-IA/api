import { Document  } from "mongoose";
import { IImage } from "./image.interface";

export interface ISpecies extends Document{
    name : String
    images : IImage[]
    description: String|null,
    sunExposure: String|null,
    watering: String|null,
    optimalTemperature: String|null,
}


export interface SpeciesForm{
    name : String
    description: String|null,
    sunExposure: String|null,
    watering: String|null,
    optimalTemperature: String|null,
}


