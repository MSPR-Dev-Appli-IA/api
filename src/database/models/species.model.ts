import  mongoose from 'mongoose';
import {ISpecies, } from '../../interfaces';
const schema = mongoose.Schema;



const speciesSchema = new mongoose.Schema<ISpecies>({
    name: { type: String, required: true ,unique:true},
    images : [{ type: schema.Types.ObjectId, ref: "image" }],
    description: { type: String, required: false ,default:null},
    sunExposure: { type: String, required: false,default:null },
    watering: { type: String, required: false ,default:null},
    optimalTemperature: { type: String, required: false,default:null },
});



export const Species = mongoose.model('Species', speciesSchema);

