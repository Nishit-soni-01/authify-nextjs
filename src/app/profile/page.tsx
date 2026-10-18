"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");
    const [loggingOut, setLoggingOut] = useState(false);
    const [loadingUser, setLoadingUser] = useState(false);

    const logout = async () => {
        try {
            setLoggingOut(true);
            await axios.get("/api/users/logout");
            toast.success("Logout successful");
            router.push("/login");
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoggingOut(false);
        }
    };

    const getUserDetails = async () => {
        try {
            setLoadingUser(true);
            const res = await axios.get("/api/users/me");
            console.log(res.data);
            setData(res.data.data._id);
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoadingUser(false);
        }
    };

    const spinner = (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Top bar */}
            <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-base font-bold text-white">
                            A
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                            Authify
                        </span>
                    </div>

                    <button
                        onClick={logout}
                        disabled={loggingOut}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        {loggingOut && spinner}
                        {loggingOut ? "Logging out…" : "Log out"}
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-4xl px-6 py-10">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    Your profile
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    You&apos;re signed in. Load your account details to see your user ID.
                </p>

                <section className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Account details
                        </h2>
                    </div>

                    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                User ID
                            </p>
                            {data === "nothing" ? (
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Not loaded yet
                                </p>
                            ) : (
                                <Link
                                    href={`/profile/${data}`}
                                    className="mt-1 inline-block max-w-full truncate rounded-md bg-indigo-50 px-2.5 py-1 font-mono text-sm text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                                >
                                    {data}
                                </Link>
                            )}
                        </div>

                        <button
                            onClick={getUserDetails}
                            disabled={loadingUser}
                            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingUser && spinner}
                            {loadingUser
                                ? "Loading…"
                                : data === "nothing"
                                ? "Load my details"
                                : "Refresh details"}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}