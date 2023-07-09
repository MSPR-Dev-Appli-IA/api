import { Address } from "../database/models/adress.model";
import {IAddress} from "../interfaces";

export const getOneAddressByCoordinates = async (address: IAddress): Promise<IAddress | null> => {
    return await Address.findOne({
        $and: [
            {"location.x":  address.location.x},
            {"location.y":  address.location.y}
        ]
    }).exec();
};



export const createAddress = async (address: IAddress) => {
    const newAddress = new Address({
        district: address.district,
        location: {
            x: address.location.x,
            y: address.location.y
        }
    });
    return await newAddress.save();
  };