"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActivateResult, activateUser } from "./actions";

export function VerifyEmailClient() {
  const params = useSearchParams();
  const token = params.get("token");

  const [result, setResult] = useState<ActivateResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await activateUser(token);
      if (!cancelled) setResult(res);
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!result) {
    return (
      <div className="rounded-xl p-8 border shadow-sm bg-white">
        <p className="text-sm">Ativando sua conta...</p>
      </div>
    );
  }

  const styles = {
    success: "bg-green-100 border-green-300 text-green-800",
    error: "bg-red-100 border-red-300 text-red-800",
  } as const;

  return (
    <div className={`rounded-xl p-8 border shadow-sm ${styles[result.type]}`}>
      <h1 className="text-2xl font-semibold mb-2">{result.title}</h1>
      <p className="text-sm">{result.message}</p>
    </div>
  );
}
