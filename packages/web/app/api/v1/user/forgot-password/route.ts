import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { mailer } from "lib/mailer";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = await withErrorHandling(forgotPassword);

async function forgotPassword(request: NextRequest) {
  const body = await request.json();
  const { email } = forgotPasswordSchema.parse(body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetLink = `${request.nextUrl.origin}/reset-password?token=${resetToken}`;

    await prisma.user.update({
      where: { id: user.id },
      data: { token: resetToken },
    });

    await mailer.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: "MigOculto - Redefinição de senha",
      text: `Você recebeu este e-mail porque solicitou a redefinição de sua senha. Clique no link para redefinir sua senha: ${resetLink}. Se você não solicitou essa alteração, por favor ignore este e-mail.`,
      html: `<p>Você recebeu este e-mail porque solicitou a redefinição de sua senha.<br/>Clique no link para redefinir sua senha: <a href="${resetLink}">${resetLink}</a><br/>Se você não solicitou essa alteração, por favor ignore este e-mail.</p>`,
    });
  }

  return NextResponse.json({}, { status: 200 });
}

const forgotPasswordSchema = z.object({
  email: z.email().nonempty(),
});
