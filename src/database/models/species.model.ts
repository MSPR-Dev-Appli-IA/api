import  mongoose from 'mongoose';
import {ISpecies, } from '../../interfaces';
const schema = mongoose.Schema;


const GeneralAdvice = new mongoose.Schema({
    description: String
})

const speciesSchema = new mongoose.Schema<ISpecies>({
    name: { type: String, required: true },
    images : [{ type: schema.Types.ObjectId, ref: "image" }],
    generalAdvices :  [GeneralAdvice]
});




export const Species = mongoose.model('Species', speciesSchema);

