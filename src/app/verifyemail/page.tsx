"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const verifyUserEmail = async () => {
        try {
            setLoading(true);
            await axios.post("/api/users/verifyemail", { token });
            setVerified(true);
        } catch (error: any) {
            setError(true);
            setErrorMessage(error.response?.data?.error || error.message);
            console.log(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Read the token from the link: /verifyemail?token=abc123
    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token");
        setToken(urlToken || "");
        if (!urlToken) setLoading(false);
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const missingToken = !loading && !verified && !error && token.length === 0;

    const primaryLink =
        "mt-6 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30";
    const secondaryLink =
        "mt-3 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-950">
            <div className="mb-8 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-base font-bold text-white">
                    A
                </span>
                <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                   Authify
                </span>
            </div>

            <div
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
                aria-live="polite"
            >
                {/* Verifying */}
                {loading && (
                    <>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                            <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                            </svg>
                        </div>
                        <h1 className="mt-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            Verifying your email…
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            This only takes a moment.
                        </p>
                    </>
                )}

                {/* Success */}
                {verified && (
                    <>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                                <path d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="mt-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            Email verified
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Your account is ready. You can now sign in.
                        </p>
                        <Link href="/login" className={primaryLink}>
                            Continue to login
                        </Link>
                    </>
                )}

                {/* Error from the server */}
                {error && (
                    <>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                                <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        </div>
                        <h1 className="mt-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            Verification failed
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            {errorMessage ||
                                "This link may be invalid or expired."}
                        </p>
                        <Link href="/signup" className={primaryLink}>
                            Back to signup
                        </Link>
                        <Link href="/login" className={secondaryLink}>
                            Go to login
                        </Link>
                    </>
                )}

                {/* No token in the URL */}
                {missingToken && (
                    <>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                                <path d="M12 9v4M12 17h.01" />
                                <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                            </svg>
                        </div>
                        <h1 className="mt-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            Invalid verification link
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            We couldn&apos;t find a token in this link. Open the link from
                            your verification email again.
                        </p>
                        <Link href="/signup" className={primaryLink}>
                            Back to signup
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}