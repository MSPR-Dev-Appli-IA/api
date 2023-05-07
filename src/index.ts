import express ,{Application,  Request, Response} from "express";
import {join} from 'path';
import  cookieParser from 'cookie-parser';
import  router from './routes';
import * as dotenv from "dotenv";
import path from "path"
dotenv.config();

import './database';

export const app:Application = express();
const compression = require("compression");

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
});

app.use(compression()); // Compress all routes

// Apply rate limiter to all requests
app.use(limiter);

app.use(express.json());
app.use(cookieParser());


import "./config/jwt.config";


app.use(express.static(path.join(__dirname, "public")));
app.use(router);

app.get('*', (_:Request, res:Response) => {
    res.sendFile(join(__dirname, '../index.html'));
})

if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT);
}
