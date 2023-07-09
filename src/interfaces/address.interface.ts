import { Document  } from "mongoose";


export interface ILocation{
    x: bigint
    y: bigint
}

export interface IAddress extends Document{
    district : string
    location: ILocation
}


export interface AddressForm{
    label : string
    countryCode : string
}


