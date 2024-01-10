require('dotenv').config();


import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router/index';


// notice that the result of `remix build` is "just a module"
import * as build from '../build/index.js';

const app = express();
app.use(express.static("public"));

// and your app is "just a request handler"
app.all("*", createRequestHandler({ build }));

app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParser()); //TODO : check if needed
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    if (process.env.NODE_ENV === "development") {
        broadcastDevReady(build);
      }
    console.log('Server is running on port 8080');
});


mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', (error:Error)=>console.log(error));
app.use('/', router());