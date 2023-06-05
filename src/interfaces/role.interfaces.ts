import { Document  } from "mongoose";

export type RoleLabel = "Admin"| "Botanist"|"User"

export interface IRole extends Document{
name : RoleLabel
}