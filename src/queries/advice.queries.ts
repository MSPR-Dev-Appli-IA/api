import { Plant } from "../database/models/plant.models";
import { Image } from "../database/models/image.model"
import { User } from "../database/models/user.model";
import { Types } from 'mongoose';
import { Advice } from "../database/models/advice.model";
import { AdviceForm, IAdvice } from "../interfaces/advice.interface";
import { Message } from "../database/models/message.model";
import { IImage } from "../interfaces";


export const getOneAdviceById = async (adviceId: Types.ObjectId): Promise<IAdvice | null> => {
    return await Advice.findOne({ _id: adviceId })
    .populate({ path: "plant", model: Plant })
    .populate({ path: "images", model: Image })
    .populate({ path: "taked_by", model: User})
    .populate({ path: "messages", model: Message })
    .exec();
};




export const findLimitedAdvicesNotTaken = async ( limit: number = 1, skip: number = 0, order: 1 | -1 = -1) => {
    return await Advice.find({
        taked_by: null,
    })
        .populate({ path: "plant", model: Plant })
        .populate({ path: "images", model: Image })
        .sort({ created_at: order }).skip(skip).limit(limit)
        .exec()
};


export const findLimitedAdvicesFoOnePlant = async ( limit: number = 1, skip: number = 0, order: 1 | -1 = -1,plantId: Types.ObjectId) => {
    return await Advice.find({
        plant: plantId
    })
        .populate({ path: "plant", model: Plant })
        .populate({ path: "images", model: Image })
        .populate({ path: "taked_by", model: User})
        .populate({ path: "messages", model: Message })
        .sort({ created_at: order }).skip(skip).limit(limit)
        .exec()
};


export const findLimitedAdvicesOfBotanist = async ( limit: number = 1, skip: number = 0, order: 1 | -1 = -1,userId: string) => {
    return await Advice.find({
        taked_by: userId,
       
    })
        .populate({ path: "plant", model: Plant })
        .populate({ path: "images", model: Image })
        .populate({ path: "messages", model: Message })
        .sort({ created_at: order }).skip(skip).limit(limit)
        .exec()
};



export const takeAnAdviceByAdviceId = async (AdviceId: Types.ObjectId,userId :Types.ObjectId) => {

    return await Advice.findByIdAndUpdate(AdviceId, {
      $set: {
        taked_by:userId
      },
    },
      { new: true })
  
  };
  

  export const deleteAdviceWithId= async (adviceId: Types.ObjectId) => {
    await Advice.findOneAndDelete(adviceId).exec();
  }
  



  export const  createAdviceWithPlantId  = async (content: String,plantId:Types.ObjectId) => {
    const newAdvice = new Advice({
    content:content,
      images: [],
      plant:plantId,
      messages:[]
    });
    return await newAdvice.save();
  
  };
  
  

  export const addImageWithAdviceId = async (image: IImage, adviceId: Types.ObjectId) => {
    return await Advice.findOneAndUpdate(
      { _id: adviceId },
      { $push: { images: image } },
      { returnDocument: 'after' }
    ).populate({ path: "images", model: Image });
  
  }



  export const   deleteImageWithAdviceId = async (imageId: Types.ObjectId, adviceId: Types.ObjectId) => {
    return await Advice.findOneAndUpdate(
      { _id: adviceId },
      { $pull: { images: imageId } },
      { returnDocument: 'after' }
    ).populate({ path: "images", model: Image });
  
  }


  export const updateAdviceIthAdviceId = async (adviceId: Types.ObjectId, advice: AdviceForm) => {
    return await Advice.findByIdAndUpdate(adviceId, {
      content:advice.content
    },
      { new: true })

  };
  
  