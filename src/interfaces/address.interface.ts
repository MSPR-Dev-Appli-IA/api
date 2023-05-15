import { Document  } from "mongoose";


export interface ILocation{
    x: bigint
    y: bigint
}

export interface IAddress extends Document{
    label : string
    location: ILocation
}


export interface AddressForm{
    label : string
    countryCode : string
}


