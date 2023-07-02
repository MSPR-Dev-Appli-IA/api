import { Document  } from "mongoose";


interface ILocation{
    x: bigint
    y: bigint
}

export interface IAddress extends Document{
    address : string
    location: ILocation
    score: bigint
}


export interface AddressForm{
    label : string
    countryCode : string
}


