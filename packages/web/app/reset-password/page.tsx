import ResetPasswordPageClient from "./reset-password";

type PageProps = {
  searchParams: {
    token?: string;
  };
};

export default function ResetPasswordPage({ searchParams }: PageProps) {
  const token = searchParams.token ?? null;

  return <ResetPasswordPageClient token={token} />;
}
