import Errors from "@/common/errors";
import { Helpers } from "@/helpers/Helpers";
import { AuthenticationService } from "@/services/Authentication/AuthenticationService";
import { NextRequest, NextResponse } from "next/server";
import config from "@/../config/config.json";

const authenticationService = new AuthenticationService();

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *               username:
 *                 type: string
 *                 description: Unique username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Missing input fields
 *   patch:
 *     summary: Verify user account
 *     description: Verifies user's email or phone number using OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email to verify
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number to verify
 *               otp:
 *                 type: string
 *                 description: One-time password received
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Account verified successfully
 *       400:
 *         description: Bad request or invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid OTP
 *   put:
 *     tags:
 *       - Users
 *     summary: Resend verification OTP to both email and phone
 *     description: Resends a verification OTP to both the email address and phone number of a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phoneNumber
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Verification OTP sent to both email and phone
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 */

export async function POST(request: NextRequest) {
  try {
    const { name, email, phoneNumber, password } = await request.json();

    if (!name || !email || !phoneNumber || !password) {
      throw new Error(Errors.MISSING_FIELDS.message);
    }

    // Validate name format
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    if (!nameRegex.test(name)) {
      throw new Error(
        "Name must be 3-50 characters long and contain only letters and spaces"
      );
    }

    // Validate email format
    if (typeof email !== "string" || email.trim() === "") {
      throw new Error(Errors.INVALID_EMAIL.message);
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error(Errors.INVALID_PHONE_NUMBER.message);
    }

    // Password validation
    const passwordRegex = config.validations.password.map((item) => ({
      regex: new RegExp(item.regex),
      message: item.message,
      error: item.error,
    }));
    const invalidPassword = passwordRegex.find((r) => !r.regex.test(password));
    if (invalidPassword) throw new Error(invalidPassword.message);

    await authenticationService.registerUser(
      name,
      email,
      phoneNumber,
      password
    );

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (e) {
    const error = Helpers.FetchError(e as Error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.status }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { email, phoneNumber, otp } = await request.json();

    if (!otp) {
      throw new Error(Errors.MISSING_FIELDS.message);
    }

    // If neither email nor phone is provided
    if (!email && !phoneNumber) {
      throw new Error(Errors.PHONE_OR_EMAIL_REQUIRED.message);
    }

    // If both email and phone are provided, verify them together
    if (email && phoneNumber) {
      await authenticationService.verifyEmailAndPhone(email, phoneNumber, otp);
    } else if (email) {
      await authenticationService.verifyAccount(email, otp);
    } else if (phoneNumber) {
      await authenticationService.verifyPhoneNumber(phoneNumber, otp);
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Account verified successfully",
      },
      { status: 200 }
    );
  } catch (e) {
    const error = Helpers.FetchError(e as Error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
      },
      { status: error.status }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authenticationService = new AuthenticationService();
    const { email, phoneNumber } = await request.json();

    if (!email || !phoneNumber) {
      return NextResponse.json(
        {
          status: "error",
          message: Errors.MISSING_FIELDS.message,
        },
        { status: 400 }
      );
    }

    const result = await authenticationService.resendVerificationOTP(
      email,
      phoneNumber
    );

    return NextResponse.json(
      {
        status: "success",
        message: "Verification OTP sent to both email and phone",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
      },
      { status: 400 }
    );
  }
}
