// entry file for express 
// express related logic

import express from 'express';
import cors from 'cors';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import { apiRouter } from './routes';

export function createApp() {

    const app = express()

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));

    app.use("/api",apiRouter);

    app.use(notFound);
    app.use(errorHandler);

    return app;
}