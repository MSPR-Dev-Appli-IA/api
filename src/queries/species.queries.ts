import {Species} from "../database/models/species.model"
import {Image} from "../database/models/image.model"
import { PipelineStage } from "mongoose";
import {SpeciesForm,IImage} from "../interfaces/index"
import  mongoose from 'mongoose';

export const findLimitedSpecies = async (limit:number=1,skip:number=0, order:1|-1=-1, search:String|null ) => {
     const  aggregateArray:PipelineStage[] = [
    {
      $lookup: {
        from: "image",
        localField: "images",
        foreignField: "_id",
        as: "images",
      },
    },
    { $sort: { name: order } },
  ];
  if (search) {
      aggregateArray.push({ $match: { name: { $regex: search } } });
  }
    return Species.aggregate(aggregateArray).skip(skip).limit(limit);
  };


  export const findOneSpecies = async (speciedId:String ) => {

    return Species.findOne({ _id: new  mongoose.Types.ObjectId(speciedId.trim()) }).populate({path:"images",model:Image}).exec();
 };

 export const updateSpecieWithSpeciesId = async (speciesId:String,species:SpeciesForm ) => {
  return await Species.findByIdAndUpdate(speciesId, {
    name: species.name,
    description: species.description,
    sunExposure: species.sunExposure,
    watering: species.watering,
    optimalTemperature: species.optimalTemperature,
  },
    {new: true})
};
  

  export const createSpecies = async (species:SpeciesForm) => {
      const newSpecies  = new Species({
        name: species.name,
        images:[],
        description: species.description,
        sunExposure: species.sunExposure,
        watering: species.watering,
        optimalTemperature: species.optimalTemperature,
      });
      return await newSpecies.save();

 };
 

 export  const addImageWithSpeciesId = async  (image:IImage,speciesId:String) => {
  return await Species.updateOne(
    { _id: speciesId }, 
    { $push: { images: image } },
    { returnDocument: 'after' }
     );
 
 }

 export  const deleteImageWithSpeciesId = async  (imageId:String,speciesId:String) => {
  return await Species.updateOne(
    { _id: speciesId }, 
    { $pull: { images: { _id: imageId } } },
    { returnDocument: 'after' }
     );
 
 }

 export  const deleteSpeciesWithSpeciesId= async  (speciesId:String) => {
    Species.findByIdAndDelete(speciesId).exec();
 }
