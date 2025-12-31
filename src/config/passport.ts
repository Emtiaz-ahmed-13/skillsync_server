import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model";

const googleClientId = (process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID || "").trim();
const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRET || "").trim();

if (!googleClientId || !googleClientSecret) {
  console.warn(
    "Missing Google Auth Keys! Please set GOOGLE_CLIENT_ID (or GOOGLE_ID) and GOOGLE_CLIENT_SECRET (or GOOGLE_SECRET) in .env"
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId || "MISSING_CLIENT_ID",
      clientSecret: googleClientSecret || "MISSING_CLIENT_SECRET",
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error("No email found from Google"), undefined);
        }

        let user = await User.findOne({ email });

        if (!user) {
          // Create new user with default role 'client'
          user = await User.create({
            name: profile.displayName,
            email: email,
            password: "google-auth-placeholder-password-" + Math.random().toString(36).slice(2), // Random placeholder password
            role: "client",
            isEmailVerified: true,
            avatar: profile.photos?.[0].value 
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
