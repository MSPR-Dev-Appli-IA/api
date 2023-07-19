

import { Document ,Model } from "mongoose";

import { IRole } from "./role.interfaces";
import { IImage } from "./image.interface";


export interface IUserLocal{
    email:string;
    password:string
}


export interface  IUser extends Document {

    username: string,
    firstname:string,
    lastname:string,
    role: IRole;
    created_at:Date,
    deleted_at:null|Date
    local: IUserLocal
    image: IImage|null;

    comparePassword(password:string):boolean
    
}

export interface UserForm {
    username: string,
    firstname:string,
    lastname:string,
    email:string,
    password:string
}

export interface UserInfo{
    username: string,
    firstname:string,
    lastname:string,
    password:string
}



export interface UserjwtToken {
    user:IUser|undefined,
    id:string|undefined,
}


export interface UserModel extends Model<IUser> {
    hashPassword(password:string):string
  }