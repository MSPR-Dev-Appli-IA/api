import mongoose from 'mongoose';
import { IMessage } from '../../interfaces';
const schema = mongoose.Schema;



const messageSchema = new mongoose.Schema<IMessage>({
    send_at: { type: Date, default: Date.now },
    content: { type: String,required:false,default: null },
    image: { type: schema.Types.ObjectId, ref: "Image", required: false, default: null },
    sender: { type: schema.Types.ObjectId, ref: "User" },
    conversation: { type: schema.Types.ObjectId, ref: "Conversation" },
});


export const Message = mongoose.model('Message', messageSchema);


