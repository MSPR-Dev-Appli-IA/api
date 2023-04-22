import  mongoose from 'mongoose';
import {IGeneralAdvice } from '../../interfaces';

const speciesSchema = new mongoose.Schema<IGeneralAdvice>({
    description: { type: String, required: true },
});




export const species = mongoose.model('Species', speciesSchema);

