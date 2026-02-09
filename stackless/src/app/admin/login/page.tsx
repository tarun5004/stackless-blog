/**
 * Admin Login Page — /admin/login
 *
 * Email + password credential login for admin access.
 * Uses NextAuth Credentials provider via server action.
 */

"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoginError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-text-primary">
            <span className="text-lg font-bold text-surface">S</span>
          </div>
          <h1 className="mt-4 text-xl font-bold text-text-primary">
            Stackless Admin
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Sign in to manage your content.
          </p>
        </div>

        {/* Error messages */}
        {(error || loginError) && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error === "CredentialsSignin" || loginError
              ? loginError || "Invalid email or password."
              : "Something went wrong. Please try again."}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-text-secondary">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
              placeholder="admin@stackless.dev"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-text-secondary">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
              placeholder="Enter password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-text-primary px-4 py-2.5 text-sm font-medium text-surface hover:bg-text-secondary disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
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
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-text-muted">
          Only the site admin can access this panel.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
