import  mongoose from 'mongoose';

const uri = (process.env.DB_USER && process.env.DB_PASSWD)
    ? "mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASSWD + "@" +  process.env.DB_HOST +  ":" + process.env.DB_PORT + "/" + process.env.DB_COLLECTION + "?authMechanism=DEFAULT"
    : "mongodb://" +  process.env.DB_HOST +  ":" + process.env.DB_PORT + "/" + process.env.DB_COLLECTION
mongoose.connect(uri).then(() => {
    console.log('Connected !')
}).catch(e => console.log(e));