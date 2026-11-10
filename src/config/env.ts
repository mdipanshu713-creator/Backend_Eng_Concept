
import dotenv from 'dotenv'

dotenv.config()

function checkRequiredEnvVariables(key:string):string {
    const value = process.env[key]

    if(!value){
        throw new Error(`Missing env variables for ${key}`)
    }

    return  value
}




export const env = {
    port: Number(process.env.PORT ?? 4000),
    isProduction: (process.env.NODE_ENV ?? "development") === "production",
    nodeEnv: process.env.NODE_ENV ?? "development",
    logLevel: process.env.LOG_LEVEL ?? "info",
    databaseUrl:checkRequiredEnvVariables("DATABASE_URL"),
    jwtAccessSecret:checkRequiredEnvVariables('JWT_SECRET'),
    jwtAccessExpiresIn:checkRequiredEnvVariables('JWT_ACCESS_EXPIRES_IN'),
    redisUrl:checkRequiredEnvVariables("REDIS_URL"),
    googleClientId:checkRequiredEnvVariables('GOOGLE_CLIENT_ID'),
    googleClientSecret:checkRequiredEnvVariables('GOOGLE_CLINET_SECRET'),
    googleRedirectUrl:checkRequiredEnvVariables('GOOGLE_CALLBACK_URL')
} as const;

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
// 10.20