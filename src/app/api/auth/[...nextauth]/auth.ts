import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { dbConnect } from "@/dbConfig/dbConfig";
import mongoose from "mongoose";
import User from "@/models/userModel";
import clientPromise from "@/lib/mongodb"; // Create this file
import { AuthenticationService } from "@/services/Authentication/AuthenticationService";
import { MongoClient } from "mongodb";

// Connect to MongoDB
dbConnect();

// Initialize auth service
const authService = new AuthenticationService();

// For debugging OAuth errors
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection in NextAuth:", reason);
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "online",
        },
      },
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          display: "popup",
        },
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email/Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Email/phone and password are required");
          }

          // Parse credentials with proper type checking
          const identifier = credentials.identifier as string;
          const password = credentials.password as string;

          // Determine if identifier is email or phone
          const isEmail = identifier.includes("@");
          const isPhone = !!identifier.match(/^\+?[1-9]\d{1,14}$/);

          try {
            // Use the existing authentication service
            const { user } = await authService.loginUser(
              null, // username
              isEmail ? identifier : null, // email
              isPhone ? identifier : null, // phoneNumber
              password
            );

            if (!user) {
              throw new Error("Invalid credentials");
            }

            // Return user in the format NextAuth expects
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              phone: user.phoneNumber,
              isAdmin: user.isAdmin,
            };
          } catch (error) {
            // Map specific error messages from authentication service
            if (error instanceof Error) {
              // Forward the exact error message from the authentication service
              throw new Error(error.message);
            }
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          console.error("Credentials authorization error:", error);
          // Return null with specific error message
          throw error;
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise as Promise<MongoClient>),
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async signIn({ user, account }) {
      console.log("Sign in callback triggered", {
        user: user?.email,
        provider: account?.provider,
        userId: user?.id,
      });

      // Allow OAuth sign-ins
      if (account?.provider === "google" || account?.provider === "facebook") {
        return true;
      }

      // Allow credentials sign-in
      if (account?.provider === "credentials") {
        return true;
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      // Add user's phone number to session if available
      if (token.phone && typeof token.phone === "string") {
        session.user.phone = token.phone;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Add phone to the token if it exists
        if ("phone" in user && user.phone) {
          token.phone = user.phone as string;
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async createUser({ user }) {
      console.log("User created:", user.email);

      // Update the user with provider information
      try {
        // Get provider info - safely handling the mongoose connection
        let provider = "credentials";

        if (mongoose.connection.readyState === 1) {
          // 1 = connected
          const accountCollection =
            mongoose.connection.db?.collection("accounts");
          if (accountCollection) {
            const account = await accountCollection.findOne({
              userId: new mongoose.Types.ObjectId(user.id),
            });
            provider = account?.provider || "credentials";
          }
        }

        // Update user with provider information
        await User.findOneAndUpdate(
          { email: user.email },
          {
            provider,
            isVerified: true,
            isEmailVerified: true,
            isActive: true,
          },
          { new: true }
        );
      } catch (error) {
        console.error("Error updating user after creation:", error);
      }
    },
    async signIn({ user, account, isNewUser }) {
      console.log("Sign-in event:", {
        email: user.email,
        provider: account?.provider,
        isNewUser,
      });
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login page on error with error in query params
  },
});
