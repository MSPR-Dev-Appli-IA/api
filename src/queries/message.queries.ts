import {IUser} from "../interfaces";
import { IImage } from "../interfaces/index"
import { Image } from "../database/models/image.model";
import { Message } from "../database/models/message.model";
import { Types } from 'mongoose';
import { IAdvice } from "../interfaces/advice.interface";
import {HttpError} from "../utils/HttpError";


export const createMessageForRequest = async (sender: IUser, receiver: IUser, requestId: string, content: string,  image: IImage | null = null) => {
  const newPlant = new Message({
    image: image,
    sender: sender,
    receiver: receiver,
    request: requestId,
    content: content,
    advice: null
  });
  return await newPlant.save();
};

export const createMessageForAdvice = async (image: IImage | null = null, user: IUser, advice: IAdvice, content: string | null = null) => {
  const newPlant = new Message({
    image: image,
    sender: user,
    request: null,
    content: content,
    advice: advice

  });
  return await newPlant.save();
};

export const findMessageById = async (messageId: Types.ObjectId) => {
  return await Message.findOne({_id: messageId})
      .populate({path: "image", model: Image})
      .exec();
};


export const deleteMessageWithMessageId = async (messageId: Types.ObjectId) => {
  await Message.findOneAndDelete(messageId).exec();
}

export const getAllMessageByBookerId = async (bookerId: string, requestId?: string): Promise<any> => {
  const temp  =
      (requestId) ? await Message.find({sender: bookerId, request: requestId}).populate("image").exec()
          : await Message.find({sender: bookerId}).populate("image").exec()

  if(temp){
    return temp
  }

  throw new  HttpError(404, "User not found.")
}

export const getLastMessageByBookerId = async (bookerId: string, requestId: string): Promise<any> => {
  const temp = await Message.find({sender: bookerId, request: requestId})
      .populate("image")
      .sort({_id: -1})
      .limit(1)
      .exec()

  if(temp){
    return temp
  }

  throw new  HttpError(404, "User not found.")
}