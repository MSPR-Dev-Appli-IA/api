

import { Document ,Model } from "mongoose";
import { Types } from 'mongoose';
import { IPlant } from "./plant.interface";

export interface IUserLocal{
    email:string;
    password:string
}


export interface  IUser extends Document {

    username: string,
    firstname:string,
    lastname:string,
    role: Types.ObjectId;
    created_at:Date,
    deleted_at:null|Date
    local: IUserLocal
    plants : IPlant[]

    comparePassword(password:string):boolean
    
}

export interface UserForm {
    username: string,
    firstname:string,
    lastname:string,
    email:string,
    password:string
}



export interface UserjwtToken {
    user:IUser|null,
    id:string|undefined,
}


export interface UserModel extends Model<IUser> {
    hashPassword(password:string):string
  }