import {IUser} from "../interfaces";
import { IImage } from "../interfaces/index"
import { Image } from "../database/models/image.model";
import { Message } from "../database/models/message.model";
import { Types } from 'mongoose';
import { IAdvice } from "../interfaces/advice.interface";
import {HttpError} from "../utils/HttpError";
import {User} from "../database/models/user.model";


export const createMessageForRequest = async (sender: string | null, receiver: string | null, requestId: string, content: string,  image: IImage | null = null) => {
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

export const getLastMessage = async (requestId: string): Promise<any> => {
  const temp = await Message.find({request: requestId})
      .populate("image")
      .sort({_id: -1})
      .limit(1)
      .exec()

  if(temp){
    return temp
  }

  throw new  HttpError(404, "User not found.")
}

export const getMessagesFor = async (from: string, to: string) => {
  const temp = await Message.find({
    $or: [
      {sender: from, receiver: to}, {sender: to, receiver: from}
    ]
  })
      .populate([{path: "sender", model: User}, {path: "receiver", model: User}])
      .sort({send_at: -1})
      .exec()

  if(temp){
    return temp
  }

  throw new HttpError(404, "Messages with its users not found.")
}