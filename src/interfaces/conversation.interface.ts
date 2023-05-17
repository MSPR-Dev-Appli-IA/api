import { Document  } from "mongoose";
import { IPlantSitting } from "./plantSitting.interface";
import { IUser } from "./user.interfaces";

export type statusLabel = "En attente"| "Accepté"|"Refusé"




export interface IConversation extends Document{
    created_at:Date
    status : statusLabel
    plantSitting : IPlantSitting
    booker: IUser|null
}


