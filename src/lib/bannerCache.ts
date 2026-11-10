import { Banner } from "../types/banner";
import { redis } from "./redis";

const ADMIN_BANNERS_CACHE_KEY = "admin:banners";
const ADMIN_BANNERS_CACHE_TTL_SECONDS = 60;

export async function getBannersFromCache(): Promise<Banner[] | null> {
    try {
        const cacheData = await redis.get(ADMIN_BANNERS_CACHE_KEY);

        if (!cacheData) {
            return null;
        }

        // Parse inside the try-catch block to handle malformed JSON safely
        return JSON.parse(cacheData) as Banner[];
    } catch (error) {
        // Log the error and return null so the application falls back to querying the database
        console.error("Redis GET Error (Admin Banners):", error);
        return null; 
    }
}

export async function setBannerCache(banners: Banner[]): Promise<void> {
    try {
        const serializedData = JSON.stringify(banners);
        
        // Note: This syntax works perfectly for 'ioredis'. 
        // If using 'redis' (Node Redis v4+), the syntax is: await redis.set(key, value, { EX: seconds });
        await redis.set(
            ADMIN_BANNERS_CACHE_KEY, 
            serializedData, 
            "EX", 
            ADMIN_BANNERS_CACHE_TTL_SECONDS
        );
    } catch (error) {
        console.error("Redis SET Error (Admin Banners):", error);
        // We don't throw here to prevent a cache write failure from crashing the main API response
    }
}

export async function clearBannersCache(): Promise<void> {
    try {
        await redis.del(ADMIN_BANNERS_CACHE_KEY);
    } catch (error) {
        console.error("Redis DEL Error (Admin Banners):", error);
    }
}