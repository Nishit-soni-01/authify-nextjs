"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const inputClass =
    "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-11 text-sm text-slate-900 " +
    "placeholder:text-slate-400 shadow-sm transition " +
    "focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/15 " +
    "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 " +
    "dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20";

function PasswordField({
    id,
    label,
    value,
    onChange,
    show,
    onToggle,
    placeholder,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
    placeholder: string;
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={show ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className={inputClass}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={show ? "Hide password" : "Show password"}
                    aria-pressed={show}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-400 transition hover:text-slate-600 focus:outline-none focus-visible:text-indigo-600 dark:hover:text-slate-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                        {show ? (
                            <>
                                <path d="M3 3l18 18" />
                                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                <path d="M9.9 5.1A9.8 9.8 0 0 1 12 5c5 0 8.5 4 9.5 7a13.4 13.4 0 0 1-2.7 4.2M6.6 6.6A13.5 13.5 0 0 0 2.5 12c1 3 4.5 7 9.5 7a9.7 9.7 0 0 0 4.4-1" />
                            </>
                        ) : (
                            <>
                                <path d="M2.5 12C3.5 9 7 5 12 5s8.5 4 9.5 7c-1 3-4.5 7-9.5 7s-8.5-4-9.5-7z" />
                                <circle cx="12" cy="12" r="3" />
                            </>
                        )}
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [tokenChecked, setTokenChecked] = useState(false);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");

    
    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token");
        setToken(urlToken || "");
        setTokenChecked(true);
    }, []);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError("");

        if (password.length < 8) {
            setFormError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirm) {
            setFormError("Passwords don't match.");
            return;
        }

        try {
            setLoading(true);
            await axios.post("/api/users/resetpassword", { token, password });
            toast.success("Password updated. Please log in.");
            router.push("/login");
        } catch (error: any) {
            console.log("Reset failed", error.message);
            setFormError(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const linkBtn =
        "mt-6 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30";

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
                {tokenChecked && !token ? (
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                                <path d="M12 9v4M12 17h.01" />
                                <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                            </svg>
                        </div>
                        <h1 className="mt-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            Invalid reset link
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            This link is missing its token. Request a new one and open the
                            link from the email.
                        </p>
                        <Link href="/forgotpassword" className={linkBtn}>
                            Request a new link
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            Set a new password
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Choose a password with at least 8 characters.
                        </p>

                        <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
                            <PasswordField
                                id="password"
                                label="New password"
                                value={password}
                                onChange={setPassword}
                                show={showPassword}
                                onToggle={() => setShowPassword((v) => !v)}
                                placeholder="Enter a new password"
                            />
                            <PasswordField
                                id="confirm"
                                label="Confirm password"
                                value={confirm}
                                onChange={setConfirm}
                                show={showPassword}
                                onToggle={() => setShowPassword((v) => !v)}
                                placeholder="Re-enter the password"
                            />

                            {formError && (
                                <div
                                    role="alert"
                                    className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                                >
                                    {formError}{" "}
                                    {formError.toLowerCase().includes("expired") && (
                                        <Link
                                            href="/forgotpassword"
                                            className="font-medium underline"
                                        >
                                            Request a new link
                                        </Link>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!password || !confirm || loading}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/30 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                            >
                                {loading && (
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                                    </svg>
                                )}
                                {loading ? "Updating…" : "Update password"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </main>
    );
}
