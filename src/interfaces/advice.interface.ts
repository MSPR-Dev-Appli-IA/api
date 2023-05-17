import { Document  } from "mongoose";
import { IImage,IUser, IPlant } from "./";

export interface IAdvice extends Document{
    created_at:Date, 
    image : IImage|null
    plant: IPlant,
    taked_by:IUser|null
    content:string
}

export interface AdviceForm {
    content:string
}





