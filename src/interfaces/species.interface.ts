import { Document  } from "mongoose";


export interface ISpecies extends Document{
    name : String
    images : String[]
    generalAdvices : GeneralAdvice[]
}


export interface GeneralAdvice {
    description : String
}