<<<<<<< HEAD
=======
import { Router, type Request, type Response, type NextFunction } from "express";
import { loginUser, registerUser } from "../services/auth_service";
import { authenticate } from "../middlewares/auth_middleware";
>>>>>>> cc85c28 (Implement user task listing and creation)

import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";

import { loginUser, registerUser } from "../services/auth_service";
import { authenticate } from "../middlewares/auth_middleware";

// Create an Express router for authentication endpoints.
export const authRouter = Router();

// POST /register — create a new user account.
authRouter.post(
  "/register",
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extract email and password from the request body.
      const { email, password } = req.body;

      // Validate details, hash password, and create the user.
      await registerUser(email, password);

      // Return success response.
      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (error) {
      // Forward errors to the centralized error handler.
      next(error);
    }
  }
);

// POST /login — authenticate an existing user.
authRouter.post(
  "/login",
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extract login credentials.
      const { email, password } = req.body;

      // Verify credentials and generate an access token.
      const { accessToken } = await loginUser(email, password);

      // Return the access token.
      res.status(200).json({
        success: true,
        data: {
          accessToken,
        },
      });
    } catch (error) {
      // Forward errors to the centralized error handler.
      next(error);
    }
  }
);

<<<<<<< HEAD
// GET /me — get the currently authenticated user's information.
authRouter.get(
  "/me",
  authenticate,
  (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  }
);
=======
// get my current user information 
// protect your route

authRouter.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});
>>>>>>> cc85c28 (Implement user task listing and creation)
