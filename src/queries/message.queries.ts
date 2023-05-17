import { IRequest,   IUser } from "../interfaces";
import { IImage } from "../interfaces/index"
import { Image } from "../database/models/image.model";
import { Message } from "../database/models/message.model";
import { Types } from 'mongoose';









export const createMessage = async (image:IImage|null=null,user:IUser,request:IRequest,content:string|null=null) => {
    const newPlant = new Message({
      image:image,
      sender: user,
      request:request,
      content:content
    });
    return await newPlant.save();
  };

  export const findMessageById = async (messageId: Types.ObjectId) => {
    return await Message.findOne({ _id: messageId })
    .populate({ path: "image", model: Image})
    .exec();
  };


  export const deleteMessageWithMessageId = async (messageId: Types.ObjectId) => {
    await Message.findOneAndDelete(messageId).exec();
  }
  
