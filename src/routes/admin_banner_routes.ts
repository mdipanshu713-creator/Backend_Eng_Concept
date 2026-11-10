
import { Router } from "express";

import { authenticate } from "../middlewares/auth_middleware";
import { requireAdmin } from "../middlewares/admin_middleware";
import { uploadSingleBannerImage } from "../middlewares/banner.middleware";

import {
  createAdminBannerService,
  deleteAdminBannerService,
  fetchAdminBanner
} from "../services/admin_banner_service";

import { AppError } from "../errors/AppError";

export const adminBannerRouter = Router();

// All routes require authentication and admin authorization
adminBannerRouter.use(authenticate, requireAdmin);


// Create a new admin banner
adminBannerRouter.post(
  "/",
  uploadSingleBannerImage,
  async (req, res, next) => {
    try {
      // Check whether an image was uploaded
      if (!req.file) {
        throw new AppError(400, "Banner image is required");
      }

      // Pass uploaded file to service layer
      const banner = await createAdminBannerService(req.file);

      res.status(201).json({
        success: true,
        data: {
          banner
        }
      });

    } catch (error) {
      next(error);
    }
  }
);


// Fetch all admin banners
adminBannerRouter.get("/", async (req, res, next) => {
  try {
    // Fetch banners from service layer
    const banners = await fetchAdminBanner();

    res.status(200).json({
      success: true,
      data: {
        banners
      }
    });

  } catch (error) {
    next(error);
  }
});

export default adminBannerRouter;


adminBannerRouter.delete("/:bannerId", async (req, res, next) => {
    try {
        await deleteAdminBannerService(req.params.bannerId);

        res.status(200).json({
            success: true,
            message: "Banner deleted successfully"
        });
        
    } catch (error) {
        // CRITICAL FIX: Pass the error to the Express global error handler.
        // If this is empty, a failed database query will hang Postman infinitely.
        next(error); 
    }
});