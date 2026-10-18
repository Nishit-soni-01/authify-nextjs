import { getDataFromToken } from "@/helper/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    // 1. Identify the user from the cookie. Any failure here (missing, invalid
    // or expired token) means the request is not authenticated.
    let userId: string;
    try {
        userId = await getDataFromToken(request);
    } catch {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Load the user, leaving out the password and all token fields
    try {
        const user = await User.findById(userId).select(
            "-password -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry"
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "User found",
            data: user,
        });
    } catch (error: any) {
        console.error("Me route error:", error.message);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}