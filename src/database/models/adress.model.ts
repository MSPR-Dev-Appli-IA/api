import  mongoose from 'mongoose';
import {IAddress } from '../../interfaces';
import {Decimal128} from "mongodb";




const addressSchema = new mongoose.Schema<IAddress>({
    address: { type: String, required: true ,unique:true},
    location: {
        x: {type: Decimal128 , required: true, unique: true},
        y: {type: Decimal128 , required: true},
    },
});





export const Address = mongoose.model('Address', addressSchema);

