"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login success");
            router.push("/profile");
        } catch (error: any) {
            console.log("Login failed", error.message);
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!buttonDisabled && !loading) onLogin();
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    const inputClass =
        "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 " +
        "placeholder:text-slate-400 shadow-sm transition " +
        "focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/15 " +
        "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 " +
        "dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20";

    return (
        <main className="grid min-h-screen bg-white dark:bg-slate-950 lg:grid-cols-2">
            {/* Brand panel (desktop only) */}
            <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white lg:flex">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-base font-bold">
                        A
                    </span>
                    <span className="text-lg font-semibold tracking-tight">Authify</span>
                </div>

                <div className="max-w-md">
                    <h2 className="text-3xl font-semibold leading-tight tracking-tight">
                        Pick up right where you left off.
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-slate-300">
                        Sign in to view your profile, manage your account, and keep your
                        data in sync across devices.
                    </p>
                </div>

                <p className="text-sm text-slate-400">
                    A learning project built with Next.js and Tailwind CSS.
                </p>

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
                />
            </aside>

            {/* Form panel */}
            <section className="flex items-center justify-center px-6 py-12 sm:px-10">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex items-center gap-2.5 lg:hidden">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-base font-bold text-white">
                            A
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                            Authify
                        </span>
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Sign in to your account
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        New here?{" "}
                        <Link
                            href="/signup"
                            className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline dark:text-indigo-400"
                        >
                            Create an account
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
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
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgotpassword"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline dark:text-indigo-400"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className={`${inputClass} pr-11`}
                                    value={user.password}
                                    onChange={(e) =>
                                        setUser({ ...user, password: e.target.value })
                                    }
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-400 transition hover:text-slate-600 focus:outline-none focus-visible:text-indigo-600 dark:hover:text-slate-300"
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                            <path d="M9.9 5.1A9.8 9.8 0 0 1 12 5c5 0 8.5 4 9.5 7a13.4 13.4 0 0 1-2.7 4.2M6.6 6.6A13.5 13.5 0 0 0 2.5 12c1 3 4.5 7 9.5 7a9.7 9.7 0 0 0 4.4-1" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <path d="M2.5 12C3.5 9 7 5 12 5s8.5 4 9.5 7c-1 3-4.5 7-9.5 7s-8.5-4-9.5-7z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={buttonDisabled || loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                        >
                            {loading && (
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-90"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                                    />
                                </svg>
                            )}
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}