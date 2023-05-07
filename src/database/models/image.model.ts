import  mongoose from 'mongoose';
import {IImage } from '../../interfaces';

const imageSchema = new mongoose.Schema<IImage>({
    path: { type: String, required: true ,unique:true},
});




export const Image = mongoose.model('Image', imageSchema);

