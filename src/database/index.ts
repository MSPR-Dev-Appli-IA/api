import  mongoose from 'mongoose';

mongoose.connect( "mongodb://127.0.0.1:27017/Arosaje").then(() => {
    console.log('Connected !')
}).catch(e => console.log(e));