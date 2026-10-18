import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const username = String(reqBody.username ?? "").trim();
        const email = String(reqBody.email ?? "").trim().toLowerCase();
        const password = String(reqBody.password ?? "");

        // 1. Validate input
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Username, email and password are required" },
                { status: 400 }
            );
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // 2. Check if the email or username is already taken
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            const field = existingUser.email === email ? "email" : "username";
            return NextResponse.json(
                { error: `A user with this ${field} already exists` },
                { status: 400 }
            );
        }

        // 3. Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        // 4. Send the verification email.
        // The account already exists at this point, so a mail failure should
        // not make the whole signup look like it failed.
        try {
            await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
        } catch (mailError: any) {
            console.error("Verification email failed:", mailError.message);
        }

        // 5. Only return safe fields, never the password hash or tokens
        return NextResponse.json(
            {
                message: "User created successfully",
                success: true,
                user: {
                    id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Signup error:", error.message);

        // Duplicate key error from MongoDB (two signups at the same moment)
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "A user with these details already exists" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}