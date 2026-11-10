import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../errors/AppError";

// ---------------------------------------------------------------------------
// 1. FAIL-FAST CONFIGURATION (SINGLETON PATTERN)
// ---------------------------------------------------------------------------
// Best Practice: Extract configuration OUT of the function bodies.
// This script runs exactly once when your Node.js server starts. 
// If credentials are missing, the app crashes instantly on startup rather than 
// failing silently and throwing errors 5 days later when a user tries to upload.
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    // We use a standard Error here instead of AppError because this happens 
    // at server initialization, not during an active HTTP request.
    throw new Error("❌ FATAL: Cloudinary credentials missing in .env file");
}

// Configure Cloudinary once globally. All subsequent SDK calls will use this.
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});

// Exported so controllers can use it for strong typing
export type UploadResult = {
    secureUrl: string;
    publicId: string;
};

// ---------------------------------------------------------------------------
// 2. IMAGE UPLOAD SERVICE
// ---------------------------------------------------------------------------
export async function uploadBannerImageToCloudinary(
    buffer: Buffer,
    options?: { folder?: string }
): Promise<UploadResult> {
    
    // Cloudinary's upload_stream relies on callbacks. We wrap it in a Promise 
    // so we can use modern `await` syntax inside our Express controllers.
    return new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                // Provide a fallback folder to keep your Cloudinary dashboard clean
                folder: options?.folder || "admin_banners"
            },
            (error, result) => {
                if (error) {
                    console.error("🚨 Cloudinary Upload Error:", error);
                    // Pass the error to our custom AppError for the global middleware
                    reject(new AppError(500, "Failed to upload image to Cloudinary"));
                    return;
                }

                if (!result) {
                    reject(new AppError(500, "Cloudinary returned an empty response"));
                    return;
                }

                // Resolve the Promise with the exact data the PostgreSQL database needs
                resolve({
                    secureUrl: result.secure_url,
                    publicId: result.public_id
                });
            }
        );

        // This is where the actual upload happens. We write the binary Buffer 
        // (usually provided by Multer) into the Cloudinary stream.
        uploadStream.end(buffer);
    });
}

// ---------------------------------------------------------------------------
// 3. IMAGE DELETION SERVICE
// ---------------------------------------------------------------------------
export async function deleteBannerImageFromCloudinary(
    publicId: string
): Promise<void> {
    try {
        // Cloudinary v2 supports Promises for the destroy method out of the box.
        const response = await cloudinary.uploader.destroy(publicId);
        
        // Defensive Check: Cloudinary doesn't throw a standard error if the 
        // image ID doesn't exist; it just returns { result: 'not found' }.
        // We ensure it either succeeded ('ok') or was already gone ('not found').
        if (response.result !== "ok" && response.result !== "not found") {
            throw new Error(`Cloudinary responded with unexpected status: ${response.result}`);
        }
    } catch (error) {
        console.error(`🚨 Cloudinary Deletion Error (ID: ${publicId}):`, error);
        // Wrap the third-party error so the frontend receives a clean JSON 
        // response rather than a raw Cloudinary stack trace.
        throw new AppError(500, "Failed to delete image from Cloudinary");
    }
}