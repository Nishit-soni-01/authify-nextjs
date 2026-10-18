import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const email = String(reqBody.email ?? "").trim().toLowerCase();
        const password = String(reqBody.password ?? "");

        // 1. Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // 2. Look up the user and check the password.
        // Both failures return the SAME message, so attackers can't use the
        // response to find out which emails have accounts.
        const user = await User.findOne({ email });
        const validPassword = user
            ? await bcryptjs.compare(password, user.password)
            : false;

        if (!user || !validPassword) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 3. Make sure the server is configured correctly
        if (!process.env.TOKEN_SECRET) {
            console.error("TOKEN_SECRET is not set in your .env file");
            return NextResponse.json(
                { error: "Something went wrong. Please try again." },
                { status: 500 }
            );
        }

        // 4. Create the token
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
            expiresIn: "1d",
        });

        // 5. Send the token in a secure cookie
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });
        response.cookies.set("token", token, {
            httpOnly: true, // JavaScript in the browser can't read it
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "lax", // helps protect against CSRF
            maxAge: 60 * 60 * 24, // 1 day, matches the token expiry
            path: "/",
        });
        return response;
    } catch (error: any) {
        console.error("Login error:", error.message);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}