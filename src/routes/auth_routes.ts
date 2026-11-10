
import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";

import { loginUser, loginWithGoogle, registerUser, startGoogleLogin } from "../services/auth_service";
import { authenticate } from "../middlewares/auth_middleware";

export const authRouter = Router();

// POST /register
authRouter.post(
    "/register",
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { email, password } = req.body;

            await registerUser(email, password);

            res.status(201).json({
                success: true,
                message: "User registered successfully",
            });
        } catch (error) {
            next(error);
        }
    }
);

// POST /login
authRouter.post(
    "/login",
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { email, password } = req.body;

            const { accessToken } = await loginUser(email, password);

            res.status(200).json({
                success: true,
                data: { accessToken },
            });
        } catch (error) {
            next(error);
        }
    }
);

// GET /me
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

// /api/auth/google
// google consent screen 

authRouter.get("/google",(_req,res) => {
    const googleAuthUrl = startGoogleLogin();
    res.redirect(googleAuthUrl)
})


authRouter.get("/google/callback",async(req,res,next) => {
    try {
        const code = req.query.code as string | undefined;
         
        const {accessToken} = await loginWithGoogle(code ?? "")

        res.status(200).json({
            success:true,
            data:{accessToken}
        });
        
    } catch (err) {
        next(err)
    }
})
