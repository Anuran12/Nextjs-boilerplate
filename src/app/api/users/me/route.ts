import { NextRequest, NextResponse } from "next/server";
import { Helpers } from "@/helpers/Helpers";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const decodedToken = Helpers.verifyToken(token);

    return NextResponse.json({
      success: true,
      user: {
        id: decodedToken.id,
        email: decodedToken.email,
        phoneNumber: decodedToken.phoneNumber,
        name: decodedToken.name,
        admin: decodedToken.admin,
      },
    });
  } catch (e) {
    const error = Helpers.FetchError(e as Error);
    console.error("Me error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.status }
    );
  }
}
