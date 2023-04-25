import {Image} from '../database/models/image.model'
import { ImageForm } from '../interfaces';


export const createImage= async (image :ImageForm) => {
      const newImage  = new Image({
        path: image.path,
      });
      return await newImage.save();

  };



  export const deleteImage= async (imageId:String) => {
    Image.findByIdAndDelete(imageId).exec();
  };