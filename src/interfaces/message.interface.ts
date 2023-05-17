import { Document  } from "mongoose";
import { IUser } from "./user.interfaces";
import { IRequest } from "./request.interface";
import { IImage } from "./image.interface";


export interface IMessage extends Document{
    send_at : Date
    sender:  IUser
    content: string|null
    image : IImage|null
    request : IRequest
}


export interface MessageForm extends Document{
    content: string

}

