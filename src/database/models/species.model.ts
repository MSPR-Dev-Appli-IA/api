import  mongoose from 'mongoose';
import {ISpecies, } from '../../interfaces';




const speciesSchema = new mongoose.Schema<ISpecies>({
    name: { type: String, required: true ,unique:true},
    image :{ type: String, required: true },
    description: { type: String, required: false ,default:null},
    edible_parts: {type:[String],required: false },
    propagation_methods: {type:[String],required: false },
});



export const Species = mongoose.model('Species', speciesSchema);

