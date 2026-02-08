"use client";

import { useState } from "react";

export default function DeployActions() {
  const [status, setStatus] = useState<
    "idle" | "deploying" | "success" | "error"
  >("idle");

  async function triggerDeploy() {
    setStatus("deploying");
    try {
      const res = await fetch("/api/admin/deploy", { method: "POST" });
      if (!res.ok) throw new Error("Deploy trigger failed");
      setStatus("success");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={triggerDeploy}
        disabled={status === "deploying"}
        className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "deploying" ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
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
            Deploying…
          </>
        ) : (
          "Trigger Rebuild"
        )}
      </button>

      {status === "success" && (
        <p className="mt-2 text-sm text-green-600">
          ✓ Deploy triggered successfully. Check Vercel for build progress.
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">
          ✕ Failed to trigger deploy. Check your deploy hook URL.
        </p>
      )}
    </div>
  );
}
