// app/activate/actions.ts
"use server";

import { prisma } from "lib/database";

export type ActivateResult =
  | {
      type: "success";
      title: string;
      message: string;
    }
  | {
      type: "error";
      title: string;
      message: string;
    };

export async function activateUser(token: string | null): Promise<ActivateResult> {
  if (!token) {
    return {
      type: "error",
      title: "Token ausente",
      message: "Nenhum token foi fornecido na URL.",
    };
  }

  const user = await prisma.user.findUnique({ where: { token } });

  if (!user) {
    return {
      type: "error",
      title: "Token inválido",
      message: "Este link de verificação é inválido ou já foi utilizado.",
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isActive: true, token: null },
  });

  return {
    type: "success",
    title: "Conta ativada com sucesso!",
    message: "Seu e-mail foi confirmado. Agora você pode acessar sua conta.",
  };
}
