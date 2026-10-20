import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helper/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const email = String(reqBody.email ?? "").trim().toLowerCase();

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (user) {
            try {
                await sendEmail({ email, emailType: "RESET", userId: user._id });
            } catch (mailError: any) {
                console.error("Reset email failed:", mailError.message);
            }
        }

        
        
        return NextResponse.json({
            success: true,
            message:
                "If an account exists for that email, a reset link has been sent.",
        });
    } catch (error: any) {
        console.error("Forgot password error:", error.message);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
