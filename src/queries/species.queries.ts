import { Species } from "../database/models/species.model"

import { SpeciesForm } from "../interfaces/index"

import { Types } from 'mongoose';


export const findLimitedSpecies = async (limit: number = 1, skip: number = 0, order: 1 | -1 = -1, search: String | null) => {

  return await Species.find({
    name: search ? { $regex: search } : /.*/
  }
  ).sort({ name: order }).skip(skip).limit(limit).exec()
};


export const findOneSpecies = async (speciedId: Types.ObjectId) => {

  return Species.findOne({ _id: speciedId }).exec();
};

export const findOneSpeciesByName = async (name: string) => {
  return Species.findOne({ name: name }).exec();
};

export const createSpecies = async (species:SpeciesForm) => {
  const newSpecies = new Species({
    name: species.name,
    image: species.image,
    description: species.description,
    edible_parts: species.edible_parts,
    propagation_methods: species.propagation_methods
  });
  return await newSpecies.save();
}





export const deleteSpeciesWithSpeciesId = async (speciesId: Types.ObjectId) => {
  await Species.findOneAndDelete(speciesId).exec();
}
