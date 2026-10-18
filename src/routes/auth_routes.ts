import { Router, type Request, type Response, type NextFunction } from "express";
import { loginUser, registerUser } from "../services/auth_service";

// Create an Express router for authentication endpoints
export const authRouter = Router();

// POST /register — create a new user account
authRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract email and password from the JSON request body
      const { email, password } = req.body;

      // Call the service to validate details, hash the password, and create the user
      await registerUser(email, password);

      // Return 201 Created when registration succeeds
      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (error) {
      // Forward errors to the centralized error-handling middleware
      next(error);
    }
  }
);

// POST /login — authenticate an existing user
authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract login credentials from the JSON request body
      const { email, password } = req.body;

      // Verify credentials and generate an access token
      const { accessToken } = await loginUser(email, password);

      // Return 200 OK and the JWT access token
      res.status(200).json({
        success: true,
        data: {
          accessToken,
        },
      });
    } catch (error) {
      // Forward errors instead of handling them inside each route
      next(error);
    }
  }
);