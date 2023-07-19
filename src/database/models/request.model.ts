import  mongoose from 'mongoose';
import {IRequest} from '../../interfaces';
const schema = mongoose.Schema;


const requestSchema = new mongoose.Schema<IRequest>({
    created_at : { type: Date, default: Date.now },
    status: { type: String, required: true,default: "Pending"},
    booker: { type: schema.Types.ObjectId, ref: "User", required: true }
});



export const Request = mongoose.model('Request', requestSchema);


