"use client";

import { useState } from "react";
import { resetPassword } from "./actions";

type Props = {
  token: string | null;
};

export default function ResetPasswordPageClient({ token }: Props) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    const newPassword = formData.get("password") as string | null;
    const confirmPassword = formData.get("confirm") as string | null;

    if (!newPassword || !confirmPassword) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }
    if (!token) {
      setErrorMessage("Link inválido ou expirado.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, newPassword);
      setErrorMessage(null);
      setSuccessMessage("Sua senha foi redefinida com sucesso. Agora você pode acessar sua conta.");
    } catch (error: any) {
      setSuccessMessage(null);
      setErrorMessage("Ocorreu um erro ao redefinir a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-[#3c0101] via-[#5f0b0b] to-[#8a1717] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col items-center">
          <img src="/images/logo.png" alt="MigOculto" className="w-24 p-2 rounded-2xl" />

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ffdf9c]">MigOculto</p>
          <h1 className="mt-1 text-center text-2xl font-bold text-[#fff7e6]">Redefinir senha</h1>
          <p className="mt-2 text-center text-sm text-[#ffe7c2]">Crie uma nova senha para continuar participando das brincadeiras!</p>
        </header>

        <div className="rounded-3xl bg-white/95 p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
          {!token ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              Link inválido ou expirado. Solicite uma nova redefinição.
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-5">
              <input type="hidden" name="token" value={token} />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-800">Nova senha</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-[#0f8f4a]/0 transition focus:border-[#0f8f4a] focus:ring-2 focus:ring-[#0f8f4a]/60"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-800">Confirmar senha</label>
                <input
                  type="password"
                  name="confirm"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-[#0f8f4a]/0 transition focus:border-[#0f8f4a] focus:ring-2 focus:ring-[#0f8f4a]/60"
                />
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{successMessage}</div>
              )}

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#0f8f4a] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0f8f4a]/40 transition hover:bg-[#0a6a37] disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Alterando senha..." : "Redefinir senha"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
