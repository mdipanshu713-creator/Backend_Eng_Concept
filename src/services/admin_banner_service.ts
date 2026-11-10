import { AppError } from "../errors/AppError";
// CRITICAL FIX: Imported the missing GET and SET cache methods
import { clearBannersCache, getBannersFromCache, setBannerCache } from "../lib/bannerCache";
import { uploadBannerImageToCloudinary } from "../lib/cloudinary";
import { addDeleteCloudinaryImageJob } from "../queues/deleteCloudinaryImage_queue";

import {
  createAdminBanner,
  deleteAdminBannerById,
  findAllAdminBannersFromDB
} from "../repositories/admin_banner_repository";

import { Banner } from "../types/banner";

// ===========================================================================
// 1. MUTATION: CREATE BANNER
// ===========================================================================
export async function createAdminBannerService(
  file: Express.Multer.File | undefined
): Promise<Banner> {

  // 1. Validate uploaded file presence
  if (!file) {
    throw new AppError(400, "Banner image is required");
  }

  // 2. Validate file buffer (Ensure Multer successfully parsed it into memory)
  if (!file.buffer || file.buffer.length === 0) {
    throw new AppError(400, "Invalid image file buffer");
  }

  // 3. Upload binary buffer to Cloudinary
  const { secureUrl, publicId } = await uploadBannerImageToCloudinary(
    file.buffer,
    { folder: "nodejs-capstone-project" }
  );

  // 4. Validate Cloudinary response
  if (!secureUrl || !publicId) {
    throw new AppError(500, "Cloudinary image upload failed");
  }

  // 5. Save banner details in PostgreSQL via the Repository layer
  const banner = await createAdminBanner(secureUrl, publicId);

  // CRITICAL FIX: Cache Invalidation
  // Because we just added a new banner to the database, the Redis cache 
  // is now outdated. We must clear it here so the next fetch gets the new data.
  await clearBannersCache();

  return banner;
}

// ===========================================================================
// 2. QUERY: FETCH ALL BANNERS (CACHE-ASIDE PATTERN)
// ===========================================================================
export async function fetchAdminBanner(): Promise<Banner[]> {
  
  // CRITICAL FIX: Re-implemented Redis Caching
  // Your provided code had dropped the Redis logic and was querying the DB 
  // every single time. We must check the "Fast Path" first.
  
  // Step 1: Check Redis
  const cachedBanners = await getBannersFromCache();
  if (cachedBanners) {
    return cachedBanners; 
  }

  // Step 2: Cache Miss -> Retrieve from PostgreSQL (Repository Layer)
  const banners = await findAllAdminBannersFromDB();

  // Step 3: Hydrate the Cache for future requests
  await setBannerCache(banners);

  return banners;
}

// ===========================================================================
// 3. MUTATION: DELETE BANNER
// ===========================================================================
export async function deleteAdminBannerService(bannerId: string): Promise<void> {
  
  // 1. Delete from PostgreSQL and return the Cloudinary ID via the Repository
  const publicId = await deleteAdminBannerById(bannerId);

  if (!publicId) {
    throw new AppError(404, "Banner not found or already deleted");
  }

  // 2. Invalidate the stale Redis cache
  await clearBannersCache();

  // 3. Queue the background job (BullMQ) to safely delete the image from Cloudinary
  // This executes instantly, freeing up the Express thread to respond to the client.
  await addDeleteCloudinaryImageJob(publicId);
}