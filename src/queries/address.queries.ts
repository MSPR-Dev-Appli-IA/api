import { Address } from "../database/models/adress.model";
import {IAddress, ILocation} from "../interfaces";

export const getOneAddressByCoordinates = async (coordinates: ILocation): Promise<IAddress | null> => {
    return await Address.findOne({
        $and: [
            {"location.x":  coordinates.x},
            {"location.y":  coordinates.y}
        ]
    }).exec();
};



export const createAddress = async (coordinates: ILocation) => {
    const newPlant = new Address({
        location: {
            x: coordinates.x,
            y: coordinates.y
        }
    });
    return await newPlant.save();
  };