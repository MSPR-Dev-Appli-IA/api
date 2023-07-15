import {IRequest, IUser} from "../interfaces";
import {Request} from "../database/models/request.model";
import {User} from "../database/models/user.model";
import {HttpError} from "../utils/HttpError";
import {PlantSitting} from "../database/models/plantSitting.model";
import {Plant} from "../database/models/plant.models";
import {findPlantUser} from "./plant.queries";


export const getOneRequestById = async (requestId: string):Promise<IRequest> => {
    const temp = await Request.findOne({_id: requestId})
        .populate({path: "booker", model: User})
        .exec();
    if (temp) {
        return temp
    }

    throw new HttpError(404, "Request Not Found.")
};

export const createRequest = async (booker: IUser): Promise<IRequest> => {
    const newRequest = new Request({
        booker: booker,
    });

    return await newRequest.save();
};


export const setStatutRequestToRefuse = async (requestId: string) => {
    const temp = await Request.findByIdAndUpdate(requestId, {
            $set: {
                "status": "Refused",
            },
        },
        {new: true})

    if (!temp) {
        throw new HttpError(500, "An error was occurred when refusing requests")
    }

};
export const setStatutRequestToAccept = async (requestId: string) => {

    const temp = await Request.findByIdAndUpdate(requestId, {
        $set: {
            "status": "Accepted",
        },
    }, {new: true})

    if (!temp) {
        throw new HttpError(500, "An error occurred while accepting the request")
    }

};

export const deleteRequestById = async (requestId: string) => {
    const temp = await Request.findOneAndDelete({_id: requestId}).exec();

    if (temp) {
        return temp
    }

    throw new HttpError(404, "Request not Found.")
}

export const findRequestByUserId = async (userId: string): Promise<any> => {
  const temp = await Request.find({booker: userId}).populate({path: "booker", model: User});

  if(temp){
      return temp
  }

  throw new HttpError(404, "User not found.")
}

export const findWaitingRequestForPlantSittingByUserId = async (userId: string) => {
    const d = new Date();
    const result: any[] = []
    const plantUser = await findPlantUser(userId)

    const temp = await PlantSitting.find({
        start_at: {$gte: d.getTime()},
        is_taken: false
    })
        .populate({
            path: "plant",
            model: Plant,
            match: {
                _id: {
                    $in: [plantUser._id]
                }
            }
        })
        .populate({
            path: "requests",
            model: Request,
            match: {status: {$in: ["Pending"]}}
        })
        .exec()


    if (temp) {
        for (let i = 0; i < temp.length; i++) {
            // We check if plantSitting have request with pending status
            if (temp[i].requests.length > 0) {
                // Foreach requests we append it in the list
                for (let z = 0; z < temp[i].requests.length; z++) {
                    result.push(temp[i].requests[z])
                }
            }
        }
        return result
    }

    throw new HttpError(404, "An error occurred when filling the plants.")
}