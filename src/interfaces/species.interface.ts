import { Document  } from "mongoose";


export interface ISpecies extends Document{
    name : String
    image : String
    description: String|null,
    edible_parts: String[] | null
    propagation_methods:  String[] | null
}


export interface SpeciesForm{
    name : String
    image : String
    description: String,
    edible_parts: String[]| null
    propagation_methods:  String[] | null
}

