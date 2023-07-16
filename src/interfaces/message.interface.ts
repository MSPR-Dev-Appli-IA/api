import { Document  } from "mongoose";
import { IUser } from "./user.interfaces";
import { IRequest } from "./request.interface";
import { IImage } from "./image.interface";
import { IAdvice } from "./advice.interface";


export interface IMessage extends Document{
    read_at : Date
    send_at : Date
    sender:  IUser
    receiver: IUser
    content: string|null
    image : IImage|null
    request : IRequest|null
    advice:IAdvice|null
}


export interface MessageForm extends Document{
    content: string

}

