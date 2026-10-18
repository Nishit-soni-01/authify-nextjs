import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Logout successful",
            success: true,
        });

        // To delete a cookie, the browser needs the same attributes it was set with
        // (path, sameSite, secure). These must match the options in the login route.
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
            expires: new Date(0),
        });

        return response;
    } catch (error: any) {
        console.error("Logout error:", error.message);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}