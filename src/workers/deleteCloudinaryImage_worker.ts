import { Worker, Job } from "bullmq";
import { deleteBannerImageFromCloudinary } from "../lib/cloudinary";
import { bullmqConnection } from "../lib/redis"; 

export const CLOUDINARY_QUEUE_NAME = "cloudinary-jobs";
export const DELETE_CLOUDINARY_IMAGE_JOB = "delete-cloudinary-image";

export interface DeleteCloudinaryImageJobData {
    publicId: string;
}

// ---------------------------------------------------------------------------
// THE WORKER
// ---------------------------------------------------------------------------
// FIX: Pass the Data Type to the Worker so job.data is automatically typed
export const deleteCloudinaryImageWorker = new Worker<DeleteCloudinaryImageJobData>(
    CLOUDINARY_QUEUE_NAME,
    async (job: Job<DeleteCloudinaryImageJobData>) => {
        
        // Guard clause: Only process if the job name matches
        if (job.name !== DELETE_CLOUDINARY_IMAGE_JOB) {
            return;
        }

        // FIX: Because we typed the Worker above, 'job.data' is already known 
        // as DeleteCloudinaryImageJobData. We no longer need the "as" keyword.
        const data = job.data; 

        // Execute the deletion
        await deleteBannerImageFromCloudinary(data.publicId);
    },
    {
        connection: bullmqConnection 
    }
);

// ---------------------------------------------------------------------------
// WORKER EVENT LISTENERS (Highly Recommended)
// ---------------------------------------------------------------------------
deleteCloudinaryImageWorker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed: Image ${job.data.publicId} deleted.`);
});

deleteCloudinaryImageWorker.on("failed", (job, err) => {
    console.error(`🚨 Job ${job?.id} failed to delete image ${job?.data.publicId}:`, err.message);
});


console.log(`👷‍♂️ Worker Started: Listening for jobs on queue [${CLOUDINARY_QUEUE_NAME}]...`);