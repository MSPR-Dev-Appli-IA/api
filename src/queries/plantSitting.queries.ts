import {PlantSitting} from "../database/models/plantSitting.model";
import {Plant} from "../database/models/plant.models";
import mongoose, {Types} from 'mongoose';
import {IPlantSitting} from "../interfaces";
import {Address} from "../database/models/adress.model";
import {Request} from "../database/models/request.model";
import {HttpError} from "../utils/HttpError";
import {getOnePlantById} from "./plant.queries";
import {getOneRequestById} from "./request.queries";
import {createMessageForRequest} from "./message.queries";

export const getOnePlantSittingById = async (plantSittingId: string): Promise<IPlantSitting> => {
    const plantInfo = await PlantSitting.findOne({_id: plantSittingId})
        .populate({path: "plant", model: Plant})
        .populate({path: "address", model: Address})
        .populate({path: "requests", model: Request})
        .exec();
    if(plantInfo){
        return plantInfo
    }
    throw new HttpError(404, "Plant Sitting not found.")
}

export const findPlantSittingsNotTakenAndNotBegin = async (order: 1 | -1 = -1, search: string | null) => {
    const d = new Date();

    const request = await PlantSitting.find({
        start_at: {$gte: d.getTime()},
        is_taken: false
    })
        .populate({
            path: "plant",
            model: Plant,
            match: {
                $and: [
                    { name: { $regex: search ? search : /.*/, $options: 'is' }}
                ]
            }
        })
        .populate({path: "address", model: Address})
        .sort({ name: order })
        .exec()

    return request
};

export const findOnePlantSittinWithRequest = async (plantSittingId: string): Promise<IPlantSitting> => {
    const temp = await PlantSitting.findOne({_id: plantSittingId})
        .populate({path: "plant", model: Plant})
        .populate({path: "address", model: Address})
        .exec()
    if(temp){
        return temp
    }

    throw new HttpError(404, "Plant sitting not found.")
};

export const setTakenPlantSittingTrue = async (plantSittingId: string) => {

    const temp = await PlantSitting.findByIdAndUpdate(plantSittingId, {
        $set: {
            is_taken: true
        },
    }, {new: true});

    if(!temp){
        throw new HttpError(500, "An error occurred when changing the plantSitting status")
    }

};


export const createPlantSitting = async (plantSitting: IPlantSitting) => {

    const newPlantSitting = new PlantSitting({
        plant: plantSitting.plant,
        description: plantSitting.description,
        start_at: plantSitting.start_at,
        end_at: plantSitting.end_at,
        address: plantSitting.address._id
    });
    return await newPlantSitting.save();

};


export const updatePlantSittingWithPlantSittingsId = async (plantSitting: IPlantSitting) => {
    return PlantSitting.findByIdAndUpdate(plantSitting._id, {
            plant: plantSitting.plant,
            description: plantSitting.description,
            start_at: plantSitting.start_at,
            end_at: plantSitting.end_at,
            address: plantSitting.address
        },
        {new: true});
};


export const deletePlantSittingWithPlantSittingId = async (plantSittingId: Types.ObjectId) => {
    await PlantSitting.findOneAndDelete(plantSittingId).exec();
}

export const getAllPlantSittingExceptRequestId = async (plantSittingId: string, requestId: string) =>{

    const temp = await PlantSitting.find({_id: plantSittingId})
        .populate({
            path: "requests",
            model: Request,
            match: {
                _id: {
                    $nin: [new mongoose.Types.ObjectId(requestId.trim())]
                }
            }
        })
        .exec();

    if(temp.length > 0){
        return temp
    }

    throw new HttpError(404, "Request not found.")
}

export const getOnePlantSittingByRequestId = async (requestId: string) => {
    // Returns PlanSitting Info filtered by request Id
    const temp = await PlantSitting.find().populate({
        path: "requests",
        model: Request,
        match: {
            _id: {
                $in: [new mongoose.Types.ObjectId(requestId.trim())]
            }
        }
    }).populate({path: "plant", model: Plant}).exec();

    for(let i = 0; i < temp.length; i++){
        if(temp[i].requests.length !== 0){
            return temp[i]
        }
    }

    throw new HttpError(404, "Request not found.")
}

export const linkPlantSittingToRequest = async (plantSitting: IPlantSitting, requestId: string) => {
    const requestInfo = await getOneRequestById(requestId)
    const plantSittingInfo = await getOnePlantSittingById(plantSitting._id.toString())

    plantSittingInfo.requests.push(requestInfo)

    return PlantSitting.findOneAndUpdate({_id: plantSitting._id}, {
        requests: plantSittingInfo.requests
    },{new: true})
}

export const rollBack = async (requestId: string) => {
    const currentPlantSitting = await getOnePlantSittingByRequestId(requestId)
    const ownerInfo = await getOnePlantById(currentPlantSitting.plant._id.toString())

    const requestInfo = await getOneRequestById(requestId)

    // Confirms the cancellation of the guarding request to the booker
    await createMessageForRequest(
        requestInfo.booker._id.toString(),
        requestInfo.booker._id.toString(),
        requestId,
        "Bonjour, vous venez de supprimer votre demande de gardiannage."
    )

    // Informs the plant owner of the deletion of the guarding request
    await createMessageForRequest(
        requestInfo.booker._id.toString(),
        ownerInfo.user._id.toString(),
        requestId,
        "Bonjour, l'utilisateur " + requestInfo.booker.username + " vient d'annuler sa demande de gardiennage."
    )

    // Informs other applicants that the plant is available again
    if(currentPlantSitting.requests.length > 0){
        for(let i = 0; i < currentPlantSitting.requests.length; i++){
            const newRequestInfo = await getOneRequestById(currentPlantSitting.requests[i]._id.toString())

            await createMessageForRequest(
                ownerInfo.user._id.toString(),
                newRequestInfo.booker._id.toString(),
                currentPlantSitting.requests[i]._id.toString(),
                "Bonjour, la demande de guardiennage de " + requestInfo.booker.username + " est de nouveau disponible. " +
                "Vous recevrez un second message si vous avez été sélectionné."
            )
        }
    }
    // Finds the user who cancels his request
    const itemIndex = currentPlantSitting.requests.indexOf(requestInfo.booker._id.toString())

    const updatePlantSitting = await PlantSitting.findByIdAndUpdate(currentPlantSitting._id.toString(), {
        $set: {
            is_taken: false,
            requests: (currentPlantSitting.requests.length > 0) ? delete currentPlantSitting.requests[itemIndex] : null
        },
    }, {new: true});

    if(!updatePlantSitting){
        throw new HttpError(500, "An error occurred when changing the plantSitting requests")
    }
}
