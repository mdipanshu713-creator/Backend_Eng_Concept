import Redis from "ioredis";
import { env } from "../config/env";

// General Redis connection
export const redis = new Redis(env.redisUrl);

// BullMQ connection configuration
const redisUrl = new URL(env.redisUrl);

export const bullmqConnection = {
    host: redisUrl.hostname,
    port: Number(redisUrl.port || 6379),
    username: redisUrl.username || undefined,
    password: redisUrl.password || undefined,
    maxRetriesPerRequest: null,
    ...(redisUrl.protocol === "rediss:" ? { tls: {} } : {}),
};