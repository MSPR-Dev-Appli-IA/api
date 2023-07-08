import { Address } from "../database/models/adress.model";
import {IAddress, ILocation} from "../interfaces";
import {HttpError} from "../utils/HttpError";

export const getOneAddressByCoordinates = async (coordinates: ILocation): Promise<IAddress> => {
    const temp = await Address.findOne({
        $and: [
            {"location.x":  coordinates.x},
            {"location.y":  coordinates.y}
        ]
    }).exec();

    if(temp){
        return temp
    }

    throw new HttpError(404, "Address not found. Please use /address endpoint.")
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