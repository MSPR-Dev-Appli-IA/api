import  mongoose from 'mongoose';
import {IImage } from '../../interfaces';

const speciesSchema = new mongoose.Schema<IImage>({
    path: { type: String, required: true ,unique:true},
});




export const species = mongoose.model('Species', speciesSchema);

