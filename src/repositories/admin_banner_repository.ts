import { clearBannersCache, getBannersFromCache, setBannerCache } from "../lib/bannerCache";
import { pool } from "../lib/db";
import { deleteAdminBannerService } from "../services/admin_banner_service";
import { Banner } from "../types/banner";

// ---------------------------------------------------------------------------
// 1. MUTATION: CREATE BANNER
// ---------------------------------------------------------------------------
export async function createAdminBanner(
    imageUrl: string,
    cloudinaryPublicId: string
): Promise<Banner> {
    const query = `
        INSERT INTO banners (
            image_url,
            cloudinary_public_id
        )
        VALUES ($1, $2)
        RETURNING
            id,
            image_url,
            cloudinary_public_id,
            created_at,
            updated_at
    `;

    // Execute query with parameterized values to prevent SQL injection
    const result = await pool.query<Banner>(query, [imageUrl, cloudinaryPublicId]);
    const banner = result.rows[0];

    if (!banner) {
        throw new Error("Failed to create banner in the database.");
    }

    // CRITICAL FIX: Scope Correction
    // Cache invalidation must happen INSIDE this function. Whenever the database 
    // state changes (Create, Update, Delete), we must clear the stale cache 
    // so the next user request pulls the fresh data.
    await clearBannersCache();

    return banner;
}

// ---------------------------------------------------------------------------
// 2. RAW DATABASE QUERY: FETCH ALL
// ---------------------------------------------------------------------------
export async function findAllAdminBannersFromDB(): Promise<Banner[]> {
    const query = `
        SELECT
            id,
            image_url,
            cloudinary_public_id,
            created_at,
            updated_at
        FROM banners
        ORDER BY created_at DESC
    `;

    const result = await pool.query<Banner>(query);
    return result.rows;
}

// ---------------------------------------------------------------------------
// 3. CACHE-WRAPPED SERVICE: THE MAIN FETCH
// ---------------------------------------------------------------------------
// This is the function your Express controllers should actually call.
// It implements the standard "Cache-Aside" architectural pattern.
export async function fetchAdminBanners(): Promise<Banner[]> {
    
    // Step 1: Check Redis cache first (The Fast Path)
    const cachedBanners = await getBannersFromCache();

    // CRITICAL FIX: Reference vs. Value
    // Previously, the code returned 'getBannersFromCache' (the function itself). 
    // It must return 'cachedBanners' (the actual evaluated data).
    if (cachedBanners) {
        return cachedBanners;
    }

    // Step 2: If cache misses, fetch raw data from PostgreSQL (The Slow Path)
    // CRITICAL FIX: Order of Operations
    // You must fetch the data from the database BEFORE trying to cache it.
    const dbBanners = await findAllAdminBannersFromDB();

    // Step 3: Store the fresh database results into Redis for future requests
    await setBannerCache(dbBanners);

    // Step 4: Return the database results to the user
    return dbBanners;
}


export async function deleteAdminBannerById(
    bannerId:string
):Promise<string | null>{
    const result = await pool.query<{cloudinary_public_id:string}>(
        `
        DELETE FROM banners
        WHERE id = $1
        RETURNING cloudinary_public_id
        `,
        [bannerId]
    )
    return result.rows[0]?.cloudinary_public_id ?? null;
}




