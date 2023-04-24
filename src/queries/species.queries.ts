import {Species} from "../database/models/species.model"
import { PipelineStage } from "mongoose";
import {GeneralAdvice,IImage} from "../interfaces/index"


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
    return Species.findOne({ _id: speciedId }).exec();
 };

 export const updateSpecieWithSpeciesId = async (speciesId:String,name:String ,generalAdvices:GeneralAdvice[]|null=null ) => {
  return await Species.findByIdAndUpdate(speciesId, {
    name: name,
    generalAdvices:generalAdvices
  },
    {new: true})
};
  

  export const createSpecies = async (images:IImage[]|null=null,generalAdvices:GeneralAdvice[]|null=null,name:String) => {
      const newSpecies  = new Species({
        name: name,
        images:images,
        generalAdvices:generalAdvices
      });
      return await newSpecies.save();

 };
 

 export  const addImageWithSpeciesId = async  (images:IImage[],speciesId:String) => {
  return await Species.updateOne(
    { _id: speciesId }, 
    { $push: { images: images } },
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
