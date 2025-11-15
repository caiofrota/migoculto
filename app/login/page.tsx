import { LoginForm } from "./form";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white/80 p-8 shadow-xl ring-1 ring-black/5 backdrop-blur-xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
