import bcrypt from "bcryptjs";
import { UnauthorizedError } from "errors";
import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { mailer } from "lib/mailer";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

async function handlePost(req: NextRequest) {
  const startMs = Date.now();
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);

    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: email,
        password: await bcrypt.hash(password, 10),
        isActive: false,
        role: "USER",
        lastLoginAt: new Date(),
        token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      },
    });

    const activationLink = `${req.nextUrl.origin}/activate?token=${user.token}`;

    const mailResponse = await mailer.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: "Ative sua conta",
      text: `Clique no link para ativar sua conta: ${activationLink}`,
      html: `<p>Clique no link para ativar sua conta: <a href="${activationLink}">${activationLink}</a></p>`,
    });
    console.log(mailResponse);

    return NextResponse.json(
      { message: "Usuário criado com sucesso. Por favor, verifique seu e-mail para ativar sua conta." },
      { status: 201 },
    );
  } catch (error) {
    // Mitigate timing attacks
    if (Date.now() - startMs < 10) await bcrypt.hash("password", 10);
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Nome de usuário ou senha está incorreto.",
        action: "Por favor, verifique seu nome de usuário e senha e tente novamente.",
      });
    }
    throw error;
  }
}

export const POST = await withErrorHandling(handlePost);

const schema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty(),
  firstName: z.string().nonempty(),
  lastName: z.string().optional(),
});
