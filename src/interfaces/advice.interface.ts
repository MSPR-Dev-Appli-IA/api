import { Document  } from "mongoose";
import { IImage,IUser, IPlant, IMessage } from "./";

export interface IAdvice extends Document{
    created_at:Date, 
    images : IImage[]
    plant: IPlant,
    taked_by:IUser|null
    content:string
    messages: IMessage[]
}

export interface AdviceForm {
    content:string
}





