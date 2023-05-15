import {PlantSitting} from "../database/models/plantSitting.model";
import {Plant} from "../database/models/plant.models";
import {Types} from 'mongoose';
import {IPlantSitting} from "../interfaces";
import {Address} from "../database/models/adress.model";


export const getOnePlantSittingById = async (plantSittingId: Types.ObjectId): Promise<IPlantSitting | null> => {
    return await PlantSitting.findOne({_id: plantSittingId}).populate({
        path: "plant",
        model: Plant
    }).populate({path: "address", model: Address}).exec();
};

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

export const findOnePlantSitting = async (plantSittingId: Types.ObjectId) => {
    return PlantSitting.findOne({_id: plantSittingId})
        .populate({path: "plant", model: Plant})
        .populate({path: "address", model: Address})
        .exec()
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
  
