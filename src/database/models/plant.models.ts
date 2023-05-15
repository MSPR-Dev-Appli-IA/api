import  mongoose from 'mongoose';
import {IPlant } from '../../interfaces';
const schema = mongoose.Schema;



const plantSchema = new mongoose.Schema<IPlant>({
    name : { type: String, required: true },
    images : [{ type: schema.Types.ObjectId, ref: "Image" }],
    species: { type: schema.Types.ObjectId, ref: "Species", required: true },
    user: { type: schema.Types.ObjectId, ref: "User", required: true },
    created_at : { type: Date, default: Date.now },
});



export const Plant = mongoose.model('Plant', plantSchema);

