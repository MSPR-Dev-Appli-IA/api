import express ,{Application,  Request, Response} from "express";
import {join} from 'path';
import  cookieParser from 'cookie-parser';
import  router from './routes';

import './database';

export const app:Application = express();
const compression = require("compression");

app.use(compression()); // Compress all routes

app.use(express.json());
app.use(cookieParser());


import "./config/jwt.config";

app.use(router);

app.get('*', (_:Request, res:Response) => {
    res.sendFile(join(__dirname, '../index.html'));
})

app.listen(8000);