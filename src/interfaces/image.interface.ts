import { Document  } from "mongoose";



export interface IImage extends Document{
    path : String
}


export interface ImageForm {
    path : String
}