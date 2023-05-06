import {Image} from '../database/models/image.model'
import { ImageForm } from '../interfaces';
import  mongoose from 'mongoose';

export const createImage= async (image :ImageForm) => {
      const newImage  = new Image({
        path: image.path,
      });
      return await newImage.save();

  };

  export const getImageById= async (imageId:String) => {
    return Image.findOne({ _id: new  mongoose.Types.ObjectId(imageId.trim()) }).exec();
  };


  export const deleteImage= async (imageId:String) => {
    Image.findByIdAndDelete(imageId).exec();
  };