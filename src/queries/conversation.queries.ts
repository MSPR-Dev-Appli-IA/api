import { PlantSitting } from "../database/models/plantSitting.model";
import { Types } from 'mongoose';
import {  IConversation, IPlantSitting, IUser } from "../interfaces";
import { Conversation } from "../database/models/conversation.model";
import { User } from "../database/models/user.model";
import { Message } from "../database/models/message.model";



export const getOneConversationById = async (conversationId: Types.ObjectId): Promise<IConversation | null> => {
    return await Conversation.findOne({ _id: conversationId })
    .populate({ path: "plantSitting", model: PlantSitting})
    .populate({ path: "booker", model: User})
    .populate({ path: "message", model: Message})
    .exec();
};

export const createConversation = async (booker:IUser,plantSitting:IPlantSitting) => {
    const newConversation = new Conversation({
     plantSitting:plantSitting,
     booker:booker
    });
    return await newConversation.save();
  };


  export const setStatutConversationToRefuse = async (conversationId: Types.ObjectId) => {

    return await Conversation.findByIdAndUpdate(conversationId, {
      $set: {
        "status": "Refusé",
      },
    },
      { new: true })
  
};
export const setStatutConversationToAccept = async (conversationId: Types.ObjectId) => {

    return await Conversation.findByIdAndUpdate(conversationId, {
      $set: {
        "status": "Accepté",
      },
    },
      { new: true })
  
};

export const deleteConversationWithId = async (conversationId: Types.ObjectId) => {
    await Conversation.findOneAndDelete(conversationId).exec();
  }
  


