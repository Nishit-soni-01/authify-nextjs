import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { token } = reqBody;

    // 1. Make sure a token was sent
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // 2. Hash the token from the email link. The database only stores the hash
    // (this matches how helpers/mailer.ts saves it).
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 3. Find the user with this token that hasn't expired yet
    const user = await User.findOne({
      verifyToken: hashedToken,
      verifyTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "This verification link is invalid or has expired" },
        { status: 400 }
      );
    }

    // 4. Mark the user as verified and clear the token so it can't be reused.
    // "isVerfied" keeps the spelling used in your user model.
    user.isVerfied = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: unknown) {
    console.error(
      "Verification error:",
      error instanceof Error ? error.message : error
    );

    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}