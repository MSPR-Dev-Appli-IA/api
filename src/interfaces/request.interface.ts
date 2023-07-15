import { Document  } from "mongoose";
import { IUser } from "./user.interfaces";

export type statusLabel = "Pending"| "Accepted"|"Refused"


export interface IRequest extends Document{
    created_at: Date
    status : statusLabel
    booker: IUser
}


