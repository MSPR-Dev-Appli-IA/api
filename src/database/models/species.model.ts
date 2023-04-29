import  mongoose from 'mongoose';
import {ISpecies, } from '../../interfaces';
const schema = mongoose.Schema;



const speciesSchema = new mongoose.Schema<ISpecies>({
    name: { type: String, required: true },
    images : [{ type: schema.Types.ObjectId, ref: "image" }],
    description: { type: String, required: false },
    sunExposure: { type: String, required: false },
    watering: { type: String, required: false },
    optimalTemperature: { type: String, required: false },
});



export const Species = mongoose.model('Species', speciesSchema);

