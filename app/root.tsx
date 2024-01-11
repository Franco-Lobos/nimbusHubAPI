// require('dotenv').config();

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from '../src/router/index';

import dotenv from 'dotenv'
dotenv.config()

const mongoUrl: string = process.env.MONGO_URL!;

const app = express();

app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParser()); //TODO : check if needed
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});


mongoose.Promise = Promise;
mongoose.connect(mongoUrl);
mongoose.connection.on('error', (error:Error)=>console.log(error));
app.use('/', router());

// export let loader: any = async () => {
//   return await Todo.find({});
// };

// const TodoList = (todos: any) => {
//   return (
//     <ul>
//       {todos.map((todo: any) => (
//         <li>{todo.title}</li>
//       ))}
//     </ul>
//   );
// };