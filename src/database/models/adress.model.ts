import  mongoose from 'mongoose';
import {IAddress } from '../../interfaces';
import {Decimal128} from "mongodb";


const addressSchema = new mongoose.Schema<IAddress>({
    district: {type: String, required: true},
    location: {
        x: {type: Decimal128 , required: true},
        y: {type: Decimal128 , required: true},
    },
});





export const Address = mongoose.model('Address', addressSchema);

