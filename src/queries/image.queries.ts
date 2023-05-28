import {Image} from '../database/models/image.model'
import { ImageForm } from '../interfaces';

export const createImage= async (image :ImageForm) => {
      const newImage  = new Image({
        path: image.path,
      });
      return await newImage.save();

  };

  export const getImageById= async (imageId :String) => {
    return Image.findOne({_id: imageId}).exec();
  };


  export const deleteImage= async (imageId:String) => {
    await Image.findByIdAndDelete(imageId).exec();
  };