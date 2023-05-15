import  mongoose from 'mongoose';
import {IAddress } from '../../interfaces';




const addressSchema = new mongoose.Schema<IAddress>({
    label: { type: String, required: true ,unique:true},
    longitude: { type: String, required: true },
    latitude: { type: String, required: true },
});





export const Address = mongoose.model('Address', addressSchema);

