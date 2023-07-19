import  mongoose from 'mongoose';
import {DATABASE_URL} from "../environments/env";



mongoose.connect(DATABASE_URL).then(() => {

    console.log('Connected !')
}).catch(e => console.log(e));