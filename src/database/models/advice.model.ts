

import  mongoose from 'mongoose';

import { IAdvice } from '../../interfaces/advice.interface';
const schema = mongoose.Schema;


const adviceShema = new mongoose.Schema<IAdvice>({
    created_at : { type: Date, default: Date.now },
    image:{ type: schema.Types.ObjectId, ref: "Image" },
    content: { type: String,required: true },
    taked_by:{ type: schema.Types.ObjectId, ref: "User", default:null },
    plant:{ type: schema.Types.ObjectId, ref: "Plant", required:true},
    messages: [{ type: schema.Types.ObjectId, ref: "Message" }],
});



export const Advice = mongoose.model('Advice', adviceShema);


