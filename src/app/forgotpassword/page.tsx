"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || loading) return;
        try {
            setLoading(true);
            await axios.post("/api/users/forgotpassword", { email });
            setSent(true);
        } catch (error: any) {
            console.log("Forgot password failed", error.message);
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 " +
        "placeholder:text-slate-400 shadow-sm transition " +
        "focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/15 " +
        "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 " +
        "dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20";

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

            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {sent ? (
                    <div className="text-center" aria-live="polite">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="M3 7l9 6 9-6" />
                            </svg>
                        </div>
                        <h1 className="mt-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            Check your email
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            If an account exists for{" "}
                            <span className="font-medium text-slate-900 dark:text-slate-200">
                                {email}
                            </span>
                            , we&apos;ve sent a link to reset your password. It expires in
                            1 hour.
                        </p>
                        <Link
                            href="/login"
                            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30"
                        >
                            Back to login
                        </Link>
                        <button
                            type="button"
                            onClick={() => setSent(false)}
                            className="mt-3 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                            Use a different email
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            Forgot your password?
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Enter the email you signed up with and we&apos;ll send you a link
                            to reset it.
                        </p>

                        <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    inputMode="email"
                                    required
                                    className={inputClass}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!email || loading}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                            >
                                {loading && (
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                                    </svg>
                                )}
                                {loading ? "Sending link…" : "Send reset link"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                            Remembered it?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                Back to login
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}