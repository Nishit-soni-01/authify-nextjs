import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const token = String(reqBody.token ?? "");
        const password = String(reqBody.password ?? "");

        if (!token) {
            return NextResponse.json(
                { error: "This reset link is invalid or has expired" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // The database stores a hash of the token, so hash the incoming one to compare
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { error: "This reset link is invalid or has expired" },
                { status: 400 }
            );
        }

        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        // Clear the token so the link can't be used a second time
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error: any) {
        console.error("Reset password error:", error.message);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}