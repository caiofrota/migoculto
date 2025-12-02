import { Suspense } from "react";
import { VerifyEmailClient } from "./verify";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center">
        <Suspense
          fallback={
            <div className="rounded-xl p-8 border shadow-sm bg-white">
              <p className="text-sm">Carregando...</p>
            </div>
          }
        >
          <VerifyEmailClient />
        </Suspense>
      </div>
    </div>
  );
}
