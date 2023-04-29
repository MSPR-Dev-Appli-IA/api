import { Document  } from "mongoose";


export interface ISpecies extends Document{
    name : String
    images : String[]
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


