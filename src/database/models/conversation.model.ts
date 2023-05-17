import  mongoose from 'mongoose';
import {IConversation} from '../../interfaces';
const schema = mongoose.Schema;



const conversationSchema = new mongoose.Schema<IConversation>({
    created_at : { type: Date, default: Date.now },
    status: { type: String, required: true,default: "En attente"},
    plantSitting: { type: schema.Types.ObjectId, ref: "PlantSitting", required: true },
    booker:{ type: schema.Types.ObjectId, ref: "User" },

});



export const Conversation = mongoose.model('Conversation', conversationSchema);


