import  mongoose from 'mongoose';

mongoose.connect( process.env.DATABASE_URL).then(() => {
    console.log('Connected !')
}).catch(e => console.log(e));