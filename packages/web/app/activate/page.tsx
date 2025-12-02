// app/activate/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActivateResult, activateUser } from "./actions";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const [result, setResult] = useState<ActivateResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function run() {
      try {
        const res = await activateUser(token);
        if (!isCancelled) {
          setResult(res);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="rounded-xl p-8 border shadow-sm bg-white">
            <p className="text-sm">Ativando sua conta...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const styles = {
    success: "bg-green-100 border-green-300 text-green-800",
    error: "bg-red-100 border-red-300 text-red-800",
  } as const;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className={`rounded-xl p-8 border shadow-sm ${styles[result.type]}`}>
          <h1 className="text-2xl font-semibold mb-2">{result.title}</h1>
          <p className="text-sm mb-6">{result.message}</p>

          <a href="/login" className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition">
            Ir para o login
          </a>
        </div>
      </div>
    </div>
  );
}
