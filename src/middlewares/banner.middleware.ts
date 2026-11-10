// Multer is Express middleware that handles multipart/form-data requests, especially file uploads.
import multer from "multer";
import { AppError } from "../errors/AppError";

// Maximum allowed file size: 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Configure Multer for image uploads
export const uploadBannerImg = multer({

    // Store uploaded files in memory as Buffer objects
    storage: multer.memoryStorage(),

    // Set upload restrictions
    limits: {
        fileSize: MAX_FILE_SIZE
    },

    // Validate uploaded file type
    fileFilter: (_req, file, callback) => {

        // Allow only image MIME types
        if (!file.mimetype.startsWith("image/")) {

            callback(
                new AppError(400, "Only image uploads are allowed")
            );

            return;
        }

        // Accept the file
        callback(null, true);
    }
});

// Accept only one image with the field name "image"
export const uploadSingleBannerImage =
    uploadBannerImg.single("image");
