import {Plant} from "../database/models/plant.models";
import {Image} from "../database/models/image.model"
import {User} from "../database/models/user.model";
import {Types} from 'mongoose';
import {Species} from "../database/models/species.model";
import {IImage, IPlant, PlantForm} from "../interfaces/index"
import {HttpError} from "../utils/HttpError";


export const getOnePlantById = async (plantId: string) => {
    const temp = await Plant.findOne({_id: plantId}).populate({path: "images", model: Image}).populate({
        path: "user",
        model: User
    }).exec();
    if(temp){
        return temp
    }
    throw new HttpError(404, "Plant not found.")
};

export const findPlantUser = async (userId: string): Promise<IPlant> => {
    const temp = await Plant.findOne({user: userId}).populate({path: "user", model: User}).exec()
    if(temp){
        return temp
    }

    throw new HttpError(404, "Not plant found.")
}

export const findLimitedPlantsByUserIdAndSpeciesId = async (userId: String, speciesId: String | null = null, limit: number = 1, skip: number = 0, order: 1 | -1 = -1, search: String | null) => {
    return await Plant.find({
        user: userId,
        name: search ? {$regex: search} : /.*/,
        ...speciesId ? {species: speciesId} : {},

    })
        .populate({path: "images", model: Image})
        .populate({path: "species", model: Species})
        .sort({created_at: order}).skip(skip).limit(limit)
        .exec()
};

export const findOnePlant = async (plantId: string): Promise<IPlant> => {
    const temp = await Plant.findOne({_id: plantId})
        .populate({path: "images", model: Image})
        .populate({path: "user", model: User})
        .populate({path: "species", model: Species})
        .exec();
    if(temp){
        return temp
    }
    throw new Error("Plant not found")
};

export const createPlant = async (image: IImage, speciesId:Types.ObjectId, userId: Types.ObjectId, name: String) => {
    const newPlant = new Plant({
        images: [image],
        species: speciesId,
        user: userId,
        name: name
    });
    return await newPlant.save();
};


export const addImageWithPlantId = async (image: IImage, plantId: string) => {
    return Plant.findOneAndUpdate(
        {_id: plantId},
        {$push: {images: image}},
        {returnDocument: 'after'}
    )
        .populate({path: "images", model: Image})
        .populate({path: "species", model: Species});
}

export const deleteImageWithPlantId = async (imageId: Types.ObjectId, plantId: string) => {
    return Plant.findOneAndUpdate(
        {_id: plantId},
        {$pull: {images: imageId}},
        {returnDocument: 'after'}
    )
        .populate({path: "images", model: Image})
        .populate({path: "species", model: Species});

}

export const deletePlantsWithPlantsId = async (plantId: Types.ObjectId) => {
    await Plant.findOneAndDelete(plantId).exec();
}


export const updatePlantWithPlantId = async (plant: PlantForm) => {
    return Plant.findByIdAndUpdate(plant.plantId, {
            name: plant.name,
            species: plant.speciesId
        },
        {new: true})
        .populate({path: "images", model: Image})
        .populate({path: "species", model: Species});
};