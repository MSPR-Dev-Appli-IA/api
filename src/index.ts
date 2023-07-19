import express, {Application, NextFunction, Request, Response} from "express";
import {join} from 'path';
import  cookieParser from 'cookie-parser';
import  router from './routes';
import * as dotenv from "dotenv";
import path from "path"

dotenv.config();

import './database';

export const app:Application = express();
const compression = require("compression");




app.use(compression()); // Compress all routes


app.use(express.json());
app.use(cookieParser());

app.use(function (_req:Request, res:Response, next:NextFunction) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,authorization"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Pass to next layer of middleware
    next();
});

import {addJwtFeatures, extractUserFromToken} from "./config/jwt.config";

app.use(extractUserFromToken);
app.use(addJwtFeatures);

app.use(express.static(path.join(__dirname, "public")));
app.use(router);

app.get('*', (_:Request, res:Response) => {
    res.sendFile(join(__dirname, '../index.html'));
})

app.listen(8000);