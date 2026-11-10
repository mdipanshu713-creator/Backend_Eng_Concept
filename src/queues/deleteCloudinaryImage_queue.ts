import { Queue } from "bullmq";
import { bullmqConnection } from "../lib/redis";

// ---------------------------------------------------------------------------
// 1. QUEUE & JOB CONSTANTS
// ---------------------------------------------------------------------------
// Best Practice: Store magic strings as constants. This prevents typos 
// when you create the Worker that listens for this specific job name.
export const CLOUDINARY_QUEUE_NAME = "cloudinary-jobs";
export const DELETE_CLOUDINARY_IMAGE_JOB = "delete-cloudinary-image";

// Define the exact shape of the data this job requires. 
// Exporting this allows the Worker file to know exactly what payload to expect.
export interface DeleteCloudinaryImageJobData {
    publicId: string;
}

// ---------------------------------------------------------------------------
// 2. QUEUE INITIALIZATION
// ---------------------------------------------------------------------------
// We instantiate the queue and provide it with TypeScript generics:
// <DataType, ReturnType, JobNameType>
export const cloudinaryQueue = new Queue<DeleteCloudinaryImageJobData, void, string>(
    CLOUDINARY_QUEUE_NAME, 
    {
        connection: bullmqConnection,
        // Optional but recommended: Add a default job option here if all jobs 
        // in this queue share the same retry logic.
    }
);

// ---------------------------------------------------------------------------
// 3. JOB PRODUCER (THE "ADD" FUNCTION)
// ---------------------------------------------------------------------------
// You will call this function in your Express controller/service instead of 
// blocking the main thread by deleting the image synchronously.
export async function addDeleteCloudinaryImageJob(
    publicId: string
): Promise<void> {
    try {
        const jobData: DeleteCloudinaryImageJobData = { 
            publicId 
        };

        // Add the job to the Redis queue
        await cloudinaryQueue.add(
            DELETE_CLOUDINARY_IMAGE_JOB, 
            jobData, 
            {
                // Fault Tolerance: If Cloudinary's API is down, BullMQ will 
                // automatically try again 3 more times before giving up.
                attempts: 3,
                
                // Exponential Backoff: Wait 3s, then 9s, then 27s between retries.
                // This gives the external API time to recover.
                backoff: {
                    type: 'exponential',
                    delay: 3000
                },
                
                // Keep Redis Clean: Instantly remove the job from Redis once successful.
                removeOnComplete: true,
                
                // Production Safety: Don't just set removeOnFail: false. 
                // If you have a bug, millions of failed jobs will crash your Redis server 
                // by using up all the RAM. Instead, keep a limit (e.g., the last 100 failed jobs)
                // so you can inspect them in a dashboard without crashing your server.
                removeOnFail: {
                    count: 100
                }
            }
        );
        
        console.log(`📥 Queued background job to delete Cloudinary image: ${publicId}`);

    } catch (error) {
        // If Redis is down, we catch the error here so the main Express route 
        // doesn't crash. You might want to log this to a service like Sentry.
        console.error("🚨 BullMQ Error: Failed to add job to queue", error);
    }
}