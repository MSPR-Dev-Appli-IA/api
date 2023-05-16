import { Address } from "../database/models/adress.model";
import { IAddress } from "../interfaces";

export const getOneAddressByLabel = async (label: String): Promise<IAddress | null> => {
    return await Address.findOne({ label: label }).exec();
};



export const createAddress = async (label:String,latitude:Number,longitude:Number) => {
    const newPlant = new Address({
        label:label,
        latitude:latitude,
        longitude:longitude
    });
    return await newPlant.save();
  };