"use client";

import { useMutation } from "@tanstack/react-query";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";

async function doPost({ username, password }: { username: string; password: string }) {
  return await fetch("/api/v1/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const emailId = useId();
  const passId = useId();

  const mutation = useMutation({
    mutationFn: doPost,
    onSuccess: (data: any) => {
      if (data.ok) {
        setLoading(false);
        router.push("/admin");
      } else {
        data.json().then((err: any) => {
          setError(err.message);
          setLoading(false);
        });
      }
    },
    onError: (error: any) => {
      setError(error?.message || "Um erro inesperado ocorreu. Por favor contate o suporte.");
      setLoading(false);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    mutation.mutateAsync({ username: email, password });
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor={emailId} className="block text-sm font-medium text-slate-700">
          E-mail
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="seuemail@dominio.com"
          required
          data-testid="email-input"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor={passId} className="block text-sm font-medium text-slate-700">
            Senha
          </label>
          <a href="#" className="text-xs font-medium text-indigo-600 hover:underline">
            Esqueci minha senha
          </a>
        </div>
        <div className="relative">
          <input
            id={passId}
            type={showPwd ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-12 text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="••••••••"
            required
            data-testid="password-input"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute inset-y-0 right-2 my-1 rounded-lg px-3 text-xs font-medium text-slate-600 hover:bg-slate-100"
            data-testid="toggle-password-visibility"
          >
            {showPwd ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </div>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" data-testid="error-message">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-indigo-600 py-2.5 font-medium text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        data-testid="submit-button"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
