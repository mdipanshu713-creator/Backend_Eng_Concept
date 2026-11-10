import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';

// Define the exact shape of the data we expect to extract from Google
export type GoogleUserProfile = {
    googleId: string;
    email: string;
};

// ============================================================================
// 1. INITIALIZE THE CLIENT
// ============================================================================
// This creates a secure, backend-only instance of the Google OAuth client.
// Because this runs on your Node.js server, your googleClientSecret is never
// exposed to the React frontend or the public internet.
const googleOauthClient = new OAuth2Client(
    env.googleClientId,
    env.googleClientSecret,
    env.googleRedirectUrl,
);

// ============================================================================
// 2. GENERATE THE LOGIN URL (Step 1 of OAuth Flow)
// ============================================================================
// Your Express route will call this function and send the URL back to React.
// React then redirects the user's browser to this Google URL to log in.
export function getGoogleAuthUrl(): string {
    return googleOauthClient.generateAuthUrl({
        // 'openid' is required to receive an ID Token containing user info.
        scope: ["openid", "email", "profile"],
        
        // 'online' means we only need immediate authentication, not offline background access.
        access_type: "online", 
        
        // Forces Google to show the account selection screen every time,
        // preventing the browser from automatically logging in the wrong user.
        prompt: "select_account", 
    });
}

// ============================================================================
// 3. EXCHANGE CODE FOR USER IDENTITY (Step 2 of OAuth Flow)
// ============================================================================
// After the user logs into Google, Google redirects them back to React with a 
// temporary 'code'. React sends that code to your Express backend, which calls this function.
export async function getGoogleUserFromAuthCode(code: string): Promise<GoogleUserProfile> {
    
    // 1. Guard clause: Ensure the frontend actually sent the code
    if (!code) {
        throw new AppError(400, "Google auth code is required");
    }

    // 2. The Token Exchange
    // Makes a secure server-to-server HTTP POST request to Google.
    // Trades the temporary 'code' + your 'client_secret' for the actual tokens.
    const { tokens } = await googleOauthClient.getToken(code);

    if (!tokens.id_token) {
        throw new AppError(401, "Google login failed: id_token missing");
    }

    // 3. Cryptographic Verification
    // This is the most critical security step. It fetches Google's public keys 
    // to mathematically prove the token's signature wasn't forged by a hacker.
    const tickedInfo = await googleOauthClient.verifyIdToken({
        idToken: tokens.id_token,
        
        // 'audience' prevents Confused Deputy attacks. It ensures this token 
        // was minted specifically for YOUR capstone project, not another app.
        audience: env.googleClientId 
    });

    // 4. Extract the verified payload data
    const payload = tickedInfo.getPayload();

    // 5. Validate the payload contains the minimum required fields
    // 'sub' stands for Subject (Google's immutable unique ID for the user)
    if (!payload?.sub || !payload.email) {
        throw new AppError(401, "Google login failed: invalid user profile");
    }

    // 6. Return the sanitized data to the Controller
    return {
        googleId: payload.sub,
        // Sanitizing the email prevents duplicate DB rows (e.g., "User@Gmail.com" vs "user@gmail.com")
        email: payload.email.toLowerCase().trim() 
    };
}