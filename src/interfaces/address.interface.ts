import { Document  } from "mongoose";


export interface IAddress extends Document{
    label : string
    longitude: string
    latitude: string
}


export interface AddressForm{
    label : String
}


