import  mongoose from 'mongoose';
import {IRequest} from '../../interfaces';
const schema = mongoose.Schema;



const requestSchema = new mongoose.Schema<IRequest>({
    created_at : { type: Date, default: Date.now },
    status: { type: String, required: true,default: "En attente"},
    plantSitting: { type: schema.Types.ObjectId, ref: "PlantSitting", required: true },
    booker:{ type: schema.Types.ObjectId, ref: "User" },
    messages : [{ type: schema.Types.ObjectId, ref: "message" }],
});



export const Request = mongoose.model('Request', requestSchema);


