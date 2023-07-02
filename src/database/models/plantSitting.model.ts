import  mongoose from 'mongoose';
import {IPlantSitting } from '../../interfaces';
const schema = mongoose.Schema;



const plantSittingSchema = new mongoose.Schema<IPlantSitting>({
    plant: { type: schema.Types.ObjectId, ref: "Plant", required: true },
    description: { type: String, required: true },
    created_at : { type: Date, default: Date.now },
    start_at : { type: Date, required: true },
    end_at : { type: Date, required: true},
    is_taken: { type: Boolean, required: true,default: false},
    address: { type: schema.Types.ObjectId, ref: "Address", required: true }
});



export const PlantSitting = mongoose.model('PlantSitting', plantSittingSchema);

