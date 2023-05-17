import { PlantSitting } from "../database/models/plantSitting.model";
import { Types } from 'mongoose';
import {  IConversation } from "../interfaces";
import { Conversation } from "../database/models/conversation.model";
import { User } from "../database/models/user.model";



export const getOneConversationById = async (conversationId: Types.ObjectId): Promise<IConversation | null> => {
    return await Conversation.findOne({ _id: conversationId })
    .populate({ path: "plantSitting", model: PlantSitting})
    .populate({ path: "booker", model: User})
    .exec();
};