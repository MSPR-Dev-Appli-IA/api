import {Image} from '../database/models/image.model'
import {IImage, ImageForm} from '../interfaces';
import {HttpError} from "../utils/HttpError";

export const createImage= async (image :ImageForm) => {
      const newImage  = new Image({
        path: image.path,
      });
      return await newImage.save();

  };

  export const getImageById= async (imageId :String): Promise<IImage> => {
    const temp = await Image.findOne({_id: imageId}).exec();
    if(temp){
        return temp;
    }
    throw new HttpError(404, "Image not found.")
  };


  export const deleteImage= async (imageId:String) => {
    await Image.findByIdAndDelete(imageId).exec();
  };