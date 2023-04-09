import  mongoose from 'mongoose';
import {IRole } from '../../interfaces';

const roleSchema = new mongoose.Schema<IRole>({
    name: { type: String, required: true },
    
});




export const Role = mongoose.model('Role', roleSchema);

