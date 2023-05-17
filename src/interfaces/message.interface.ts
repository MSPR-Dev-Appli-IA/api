import { Document  } from "mongoose";
import { IUser } from "./user.interfaces";
import { IConversation } from "./conversation.interface";


export interface IMessage extends Document{
    send_at : Date
    sender:  IUser
    content: string|null
    image : IMessage|null
    conversation : IConversation
}


export interface MessageForm extends Document{
    content: string

}

