import { PlantSitting } from "../database/models/plantSitting.model";
import { Types } from 'mongoose';
import {  IRequest, IPlantSitting, IUser } from "../interfaces";
import { Request } from "../database/models/request.model";
import { User } from "../database/models/user.model";
import { Message } from "../database/models/message.model";
import {HttpError} from "../utils/HttpError";



export const getOneRequestById = async (requestId: string): Promise<IRequest> => {
    const temp = await Request.findOne({ _id: requestId })
        .populate({ path: "plantSitting", model: PlantSitting})
        .populate({ path: "booker", model: User})
        .populate({ path: "message", model: Message})
        .exec();
    if(temp){
        return temp
    }

    throw new HttpError(404, "Request Not Found.")
};

export const createRequest = async (booker:IUser,plantSitting:IPlantSitting) => {
    const newRequest = new Request({
     plantSitting:plantSitting,
     booker:booker,
     messages:[]

    });
    return await newRequest.save();
  };


export const setStatutRequestToRefuse = async (requestId: string) => {
    const temp = await Request.findByIdAndUpdate(requestId, {
            $set: {
                "status": "Refusé",
            },
        },
        {new: true})
    if(temp){
        return temp
    }

    throw new HttpError(404, "Request not found.")

};
export const setStatutRequestToAccept = async (requestId: Types.ObjectId) => {

    return await Request.findByIdAndUpdate(requestId, {
      $set: {
        "status": "Accepté",
      },
    },
      { new: true })
  
};

export const deleteRequestWithId = async (requestId: string) => {
    const temp = await Request.findOneAndDelete({ _id: requestId }).exec();

    if (temp){
        return temp
    }

    throw new HttpError(404, "Request not Found.")
  }
  


