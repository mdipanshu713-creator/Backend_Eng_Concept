import { AppError } from "../errors/AppError";
import { getGoogleAuthUrl, getGoogleUserFromAuthCode } from "../lib/google";
import { signAccessToken } from "../lib/jwt";
import {
  findUserByEmail,
  createUser,
  findUserByEmailWithPassword,
  findUserByGoogleId,
  linkGoogleIduser,
  createGoogleUser,
} from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import { User } from "../types/user";

// Register a new user account
export async function registerUser(
  email: string,
  password: string
): Promise<void> {
  // Validate required fields
  if (!email?.trim() || !password) {
    throw new AppError(400, "Email and password are required");
  }

  // Enforce the minimum password length
  if (password.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters");
  }

  // Normalize email to avoid case and whitespace differences
  const normalizedEmail = email.trim().toLowerCase();

  // Check whether an account already exists
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new AppError(409, "Email already registered");
  }

  // Hash the password before storing it in the database
  const passwordHash = await bcrypt.hash(password, 10);

  // Save the email and password hash through the repository
  await createUser(normalizedEmail, passwordHash);
}

// Log in an existing user and return an access token
export async function loginUser(
  email: string,
  password: string
): Promise<{ accessToken: string }> {
  // Validate required credentials
  if (!email?.trim() || !password) {
    throw new AppError(400, "Email and password are required");
  }

  // Normalize email consistently with registration
  const normalizedEmail = email.trim().toLowerCase();

  // Fetch the user with password_hash for verification
  const user = await findUserByEmailWithPassword(normalizedEmail);

  // Use a generic message to avoid revealing whether an email exists
  if (!user?.password_hash) {
    throw new AppError(401, "Invalid email or password");
  }

  // Compare the submitted password with the stored hash
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  // Generate a JWT containing the authenticated user's information
  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Return the token to the route handler
  return { accessToken };
}


export function startGoogleLogin():string{
  return getGoogleAuthUrl()
}

function createAccessTokenForUser(user:User):string{
  return signAccessToken({
    userId:user.id,
    email:user.email,
    role:user.role
  })
}

export async function loginWithGoogle(code:string):Promise<{accessToken:string}>{
  const googleProfile = await getGoogleUserFromAuthCode(code)
  
  let user = await findUserByGoogleId(googleProfile.googleId)
   
  if(!user){
    user = await findUserByEmail(googleProfile.email)

    if(user){
      // link this google account to the existing email user
      // first time login - create the user in postgresDB

      user = await linkGoogleIduser(user.id,googleProfile.googleId)
    } else {
      // first time login - create the user in postgresDB
      user = await createGoogleUser(googleProfile.email,googleProfile.googleId)
    }
  }

  const accessToken = createAccessTokenForUser(user);

  return {accessToken};

}

