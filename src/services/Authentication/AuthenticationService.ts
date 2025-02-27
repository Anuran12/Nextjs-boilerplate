import { dbConnect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
// import Mail from "nodemailer/lib/mailer";
import { MailingService } from "../Mailer/MailingService";
import Errors from "@/common/errors";
import { Helpers } from "@/helpers/Helpers";
import config from "@/../config/config.json";
import { SMSService } from "../SMS/SMSService";

dbConnect();

export class AuthenticationService {
  mailer: MailingService;
  smsService: SMSService;

  constructor() {
    this.mailer = new MailingService();
    this.smsService = new SMSService();
  }

  registerUser = async (
    name: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => {
    try {
      // Check if email exists
      const userByEmail = await User.findOne({ email });
      if (userByEmail) {
        throw new Error(Errors.USER_ALREADY_EXISTS.message);
      }

      // Check if phone exists
      const userByPhone = await User.findOne({ phoneNumber });
      if (userByPhone) {
        throw new Error(Errors.PHONE_ALREADY_EXISTS.message);
      }

      const salt = await Helpers.salt(10);
      const hashedPassword = await Helpers.hash(password, salt);

      const newUser = new User({
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        mfa_enabled: config.mfa.enabled,
      });

      const savedUser = await newUser.save();

      // Generate single OTP for both email and phone verification
      const verificationOtp = Helpers.generateOtp(
        config.registeration.emailVerification.otpLength
      );

      await User.findByIdAndUpdate(savedUser._id, {
        emailVerificationOTP: verificationOtp,
        phoneVerificationOTP: verificationOtp,
        verificationOTPExpiry:
          Date.now() +
          config.registeration.emailVerification.expiryInMinutes * 60 * 1000,
      });

      // Send the same OTP to both email and phone
      await this.mailer.sendVerificationOTPEmail(email, verificationOtp);
      await this.smsService.sendVerificationOTP(phoneNumber, verificationOtp);

      return savedUser;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error(Errors.UNKNOWN_ERROR.message);
      }
    }
  };

  loginUser = async (
    username: string | null,
    email: string | null,
    phoneNumber: string | null,
    password: string
  ) => {
    if (!username && !email && !phoneNumber) {
      throw new Error(Errors.USERNAME_OR_EMAIL_OR_PHONE_REQUIRED.message);
    }
    if (!password) {
      throw new Error(Errors.PASSWORD_REQUIRED.message);
    }

    try {
      // Create query conditions only for provided values
      const queryConditions = [];
      if (username) queryConditions.push({ username });
      if (email) queryConditions.push({ email });
      if (phoneNumber) queryConditions.push({ phoneNumber });

      const user = await User.findOne({
        $or: queryConditions,
      });

      if (!user) {
        throw new Error(Errors.INVALID_USER.message);
      }

      const isMatch = await Helpers.compare(password, user.password);
      if (!isMatch) {
        throw new Error(Errors.INVALID_CREDENTIALS.message);
      }

      if (user.email && !user.isEmailVerified) {
        throw new Error(Errors.EMAIL_NOT_VERIFIED.message);
      }

      if (user.phoneNumber && !user.isPhoneVerified) {
        throw new Error(Errors.PHONE_NOT_VERIFIED.message);
      }

      if (!user.isActive) {
        throw new Error(Errors.INACTIVATED_USER.message);
      }

      const token = Helpers.generateToken({
        id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        name: user.name,
        admin: user.isAdmin,
      });

      return { token, user };
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error(Errors.UNKNOWN_ERROR.message);
      }
    }
  };

  verifyAccount = async (email: string, otp: string) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error(Errors.INVALID_USER.message);
      }
      if (user.isEmailVerified) {
        throw new Error(Errors.EMAIL_ALREADY_VERIFIED.message);
      }
      if (user.emailVerificationOTP !== otp) {
        throw new Error(Errors.INVALID_OTP.message);
      }
      if (user.emailVerificationOTPExpiry < Date.now()) {
        throw new Error(Errors.OTP_EXPIRED.message);
      }
      user.isEmailVerified = true;
      user.isActive = true;
      await user.save();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message, "while verifying account");
        throw new Error(e.message);
      } else {
        console.error("An unknown error occurred while verifying account");
        throw new Error(Errors.UNKNOWN_ERROR.message);
      }
    }
  };

  verifyPhoneNumber = async (phoneNumber: string, otp: string) => {
    try {
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        throw new Error(Errors.INVALID_USER.message);
      }
      if (user.isPhoneVerified) {
        throw new Error(Errors.PHONE_ALREADY_VERIFIED.message);
      }
      if (user.phoneVerificationOTP !== otp) {
        throw new Error(Errors.INVALID_OTP.message);
      }
      if (user.verificationOTPExpiry < Date.now()) {
        throw new Error(Errors.OTP_EXPIRED.message);
      }
      user.isPhoneVerified = true;
      user.isActive = true;
      await user.save();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message, "while verifying phone number");
        throw new Error(e.message);
      } else {
        console.error("An unknown error occurred while verifying phone number");
        throw new Error(Errors.UNKNOWN_ERROR.message);
      }
    }
  };

  // New method to verify both email and phone together with the same OTP
  verifyEmailAndPhone = async (
    email: string,
    phoneNumber: string,
    otp: string
  ) => {
    try {
      const user = await User.findOne({
        email,
        phoneNumber,
      });

      if (!user) {
        throw new Error(Errors.INVALID_USER.message);
      }

      // Check if either email or phone is already verified
      if (user.isEmailVerified && user.isPhoneVerified) {
        throw new Error("Both email and phone are already verified.");
      }

      // Verify that the OTP matches (should be the same for both)
      if (
        user.emailVerificationOTP !== otp ||
        user.phoneVerificationOTP !== otp
      ) {
        throw new Error(Errors.INVALID_OTP.message);
      }

      // Check if OTP is expired
      if (user.verificationOTPExpiry < Date.now()) {
        throw new Error(Errors.OTP_EXPIRED.message);
      }

      // Verify both email and phone
      user.isEmailVerified = true;
      user.isPhoneVerified = true;
      user.isActive = true;

      await user.save();

      return {
        success: true,
        message: "Email and phone verified successfully",
      };
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message, "while verifying email and phone");
        throw new Error(e.message);
      } else {
        console.error(
          "An unknown error occurred while verifying email and phone"
        );
        throw new Error(Errors.UNKNOWN_ERROR.message);
      }
    }
  };

  // Method to resend OTP to both email and phone
  resendVerificationOTP = async (email: string, phoneNumber: string) => {
    try {
      const user = await User.findOne({ email, phoneNumber });

      if (!user) {
        throw new Error(Errors.INVALID_USER.message);
      }

      if (user.isEmailVerified && user.isPhoneVerified) {
        throw new Error("Both email and phone are already verified");
      }

      // Generate single OTP for both email and phone verification
      const verificationOtp = Helpers.generateOtp(
        config.registeration.emailVerification.otpLength
      );

      // Update the user with new OTP
      user.emailVerificationOTP = verificationOtp;
      user.phoneVerificationOTP = verificationOtp;
      user.verificationOTPExpiry = new Date(
        Date.now() +
          config.registeration.emailVerification.expiryInMinutes * 60 * 1000
      );

      await user.save();

      // Send the same OTP to both email and phone
      await this.mailer.sendVerificationOTPEmail(email, verificationOtp);
      await this.smsService.sendVerificationOTP(phoneNumber, verificationOtp);

      return {
        success: true,
        message: "Verification OTP sent to both email and phone",
      };
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message, "while resending verification OTP");
        throw new Error(e.message);
      } else {
        console.error(
          "An unknown error occurred while resending verification OTP"
        );
        throw new Error(Errors.UNKNOWN_ERROR.message);
      }
    }
  };
}
