// combine all ur routes of application 
// 1000
// plugin all routes in one place 


import {Router} from 'express';
import { healthRouter } from './health_routes';
import { authRouter} from "./auth_routes";

export const apiRouter = Router()

apiRouter.use(healthRouter);
apiRouter.use("/auth",authRouter)