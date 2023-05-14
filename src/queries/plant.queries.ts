import { Plant } from "../database/models/plant.models";
import { Image } from "../database/models/image.model"
import { User } from "../database/models/user.model";
import { IPlant } from "../interfaces";
import { Types } from 'mongoose';
import { Species } from "../database/models/species.model";
import { IImage,PlantForm } from "../interfaces/index"


export const getOnePlantById = async (plantId: Types.ObjectId): Promise<IPlant | null> => {
    return await Plant.findOne({ _id: plantId }).populate({ path: "images", model: Image }).populate({ path: "user", model: User }).exec();
};



export const findLimitedPlantsByUserIdAndSpeciesId = async (userId: String, speciesId: String| null = null, limit: number = 1, skip: number = 0, order: 1 | -1 = -1,search: String | null) => {
    return await Plant.find({
        user: userId,
        name: search ? { $regex: search } : /.*/,
        ...speciesId ? { species:  speciesId } : {},

    })
        .populate({ path: "images", model: Image })
        .populate({ path: "species", model: Species })
        .sort({ created_at: order }).skip(skip).limit(limit)
        .exec()
};

export const findOnePlant = async (plantId: Types.ObjectId) => {
    return Plant.findOne({ _id: plantId })
        .populate({ path: "images", model: Image })
        .populate({ path: "species", model: Species })
        .exec();
};

export const createPlant = async (speciesId:Types.ObjectId,userId:Types.ObjectId,name:String) => {
    const newPlant = new Plant({
      images: [],
      species:speciesId,
      user:userId,
      name:name
    });
    return await newPlant.save();
  };


  export const addImageWithPlantId = async (image: IImage, plantId: Types.ObjectId) => {
    return await Species.findOneAndUpdate(
      { _id: plantId },
      { $push: { images: image } },
      { returnDocument: 'after' }
    )
    .populate({ path: "images", model: Image })
    .populate({ path: "species", model: Species });
  
  }

  export const deleteImageWithPlantId = async (imageId: Types.ObjectId, plantId: Types.ObjectId) => {
    return await Plant.findOneAndUpdate(
      { _id: plantId },
      { $pull: { images: imageId } },
      { returnDocument: 'after' }
    )
    .populate({ path: "images", model: Image })
    .populate({ path: "species", model: Species });
  
  }
  
  export const deletePlantsWithPlantsId = async (plantId: Types.ObjectId) => {
    await Plant.findOneAndDelete(plantId).exec();
  }
  

  export const updatePlantWithPlantId = async (plantId: Types.ObjectId, plant:PlantForm) => {
    return await Plant.findByIdAndUpdate(plantId, {
      name: plant.name, 
    },
      { new: true })
  };