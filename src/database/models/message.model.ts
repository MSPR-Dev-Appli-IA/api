import mongoose from 'mongoose';
import { IMessage } from '../../interfaces';
const schema = mongoose.Schema;



const messageSchema = new mongoose.Schema<IMessage>({
    sender: { type: schema.Types.ObjectId, ref: "User" },
    receiver: { type: schema.Types.ObjectId, ref: "User" },

    send_at: { type: Date, default: Date.now },
    read_at: { type: Date, default: null },
    content: { type: String,required:false, default: null },
    image: { type: schema.Types.ObjectId, ref: "Image", required: false, default: null },

    request: { type: schema.Types.ObjectId, ref: "Request", default:null },
    advice: { type: schema.Types.ObjectId, ref: "Advice", default:null },
});


export const Message = mongoose.model('Message', messageSchema);