import  mongoose from 'mongoose';
import {IPlant } from '../../interfaces';
const schema = mongoose.Schema;



const plantSchema = new mongoose.Schema<IPlant>({
    images : [{ type: schema.Types.ObjectId, ref: "image" }],
    species: { type: schema.Types.ObjectId, ref: "Species", required: true },
    user: { type: schema.Types.ObjectId, ref: "User", required: true },
});



export const Plant = mongoose.model('Plant', plantSchema);

