
import Link from "next/link";
import { Suspense } from "react";

type UserProfileProps = {
    params: Promise<{ id: string }>;
};

export default function UserProfile({ params }: UserProfileProps) {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                    <p className="text-slate-600 dark:text-slate-400">
                        Loading profile...
                    </p>
                </div>
            }
        >
            <ProfileContent params={params} />
        </Suspense>
    );
}

async function ProfileContent({ params }: UserProfileProps) {
    const { id } = await params;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
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

                    <Link
                        href="/profile"
                        className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        Back to profile
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-6 py-10">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    User profile
                </h1>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Details for the account with the ID below.
                </p>

                <section className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Account details
                        </h2>
                    </div>

                    <dl className="px-6 py-5">
                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            User ID
                        </dt>
                        <dd className="mt-1">
                            <span className="inline-block max-w-full break-all rounded-md bg-indigo-50 px-2.5 py-1 font-mono text-sm text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                                {id}
                            </span>
                        </dd>
                    </dl>
                </section>
            </main>
        </div>
    );
}
