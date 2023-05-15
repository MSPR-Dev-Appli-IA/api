import { Species } from "../database/models/species.model"
import { Image } from "../database/models/image.model"

import { SpeciesForm, IImage } from "../interfaces/index"
import { Types } from 'mongoose';


export const findLimitedSpecies = async (limit: number = 1, skip: number = 0, order: 1 | -1 = -1, search: String | null) => {

  return await Species.find({
    name: search ? { $regex: search } : /.*/
  }
  ).sort({ name: order }).skip(skip).limit(limit).exec()
};


export const findOneSpecies = async (speciedId: Types.ObjectId) => {

  return Species.findOne({ _id: speciedId }).populate({ path: "images", model: Image }).exec();
};

export const updateSpecieWithSpeciesId = async (speciesId: Types.ObjectId, species: SpeciesForm) => {
  return await Species.findByIdAndUpdate(speciesId, {
    name: species.name,
    description: species.description,
    sunExposure: species.sunExposure,
    watering: species.watering,
    optimalTemperature: species.optimalTemperature,
  },
    { new: true })
};


export const createSpecies = async (species: SpeciesForm) => {
  const newSpecies = new Species({
    name: species.name,
    images: [],
    description: species.description,
    sunExposure: species.sunExposure,
    watering: species.watering,
    optimalTemperature: species.optimalTemperature,
  });
  return await newSpecies.save();

};


export const addImageWithSpeciesId = async (image: IImage, speciesId: Types.ObjectId) => {
  return await Species.findOneAndUpdate(
    { _id: speciesId },
    { $push: { images: image } },
    { returnDocument: 'after' }
  ).populate({ path: "images", model: Image });

}

export const deleteImageWithSpeciesId = async (imageId: Types.ObjectId, speciesId: Types.ObjectId) => {
  return await Species.findOneAndUpdate(
    { _id: speciesId },
    { $pull: { images: imageId } },
    { returnDocument: 'after' }
  ).populate({ path: "images", model: Image });

}

export const deleteSpeciesWithSpeciesId = async (speciesId: Types.ObjectId) => {
  await Species.findOneAndDelete(speciesId).exec();
}
