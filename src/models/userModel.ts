import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      min: 3,
      max: 255,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      max: 255,
      min: 6,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
      max: 1024,
      min: 5,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    mfa_enabled: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "facebook"],
      default: "credentials",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    emailVerificationOTP: String,
    phoneVerificationOTP: String,
    verificationOTPExpiry: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Create compound indexes with partial filter expressions
userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $ne: null } },
  }
);

userSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phoneNumber: { $exists: true, $ne: null },
      $and: [{ phoneNumber: { $ne: "" } }],
    },
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
