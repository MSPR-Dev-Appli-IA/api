import  mongoose from 'mongoose';
import {ISpecies } from '../../interfaces';
const schema = mongoose.Schema;

const speciesSchema = new mongoose.Schema<ISpecies>({
    name: { type: String, required: true },
    images : [{ type: schema.Types.ObjectId, ref: "image" }],
    generalAdvices :  [{ type: schema.Types.ObjectId, ref: "image" }]
});




export const species = mongoose.model('Species', speciesSchema);

