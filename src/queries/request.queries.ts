import { PlantSitting } from "../database/models/plantSitting.model";
import { Types } from 'mongoose';
import {  IRequest, IPlantSitting, IUser } from "../interfaces";
import { Request } from "../database/models/request.model";
import { User } from "../database/models/user.model";
import { Message } from "../database/models/message.model";



export const getOneRequestById = async (requestId: Types.ObjectId): Promise<IRequest | null> => {
    return await Request.findOne({ _id: requestId })
    .populate({ path: "plantSitting", model: PlantSitting})
    .populate({ path: "booker", model: User})
    .populate({ path: "message", model: Message})
    .exec();
};

export const createRequest = async (booker:IUser,plantSitting:IPlantSitting) => {
    const newRequest = new Request({
     plantSitting:plantSitting,
     booker:booker,
     messages:[]

    });
    return await newRequest.save();
  };


  export const setStatutRequestToRefuse = async (requestId: Types.ObjectId) => {

    return await Request.findByIdAndUpdate(requestId, {
      $set: {
        "status": "Refusé",
      },
    },
      { new: true })
  
};
export const setStatutRequestToAccept = async (requestId: Types.ObjectId) => {

    return await Request.findByIdAndUpdate(requestId, {
      $set: {
        "status": "Accepté",
      },
    },
      { new: true })
  
};

export const deleteRequestWithId = async (requestId: Types.ObjectId) => {
    await Request.findOneAndDelete(requestId).exec();
  }
  


