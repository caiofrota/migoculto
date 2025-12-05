import bcrypt from "bcryptjs";
import { UnauthorizedError } from "errors";
import { withErrorHandling } from "errors/handler";
import { addDoc, collection } from "firebase/firestore";
import { prisma } from "lib/database";
import { firestore } from "lib/firebase";
import { mailer } from "lib/mailer";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../session/authentication";

export const POST = await withErrorHandling(createUser);
export const PUT = await withErrorHandling(updateUser);

async function createUser(req: NextRequest) {
  const startMs = Date.now();
  try {
    const body = await req.json();
    const { email, password } = createSchema.parse(body);

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

async function updateUser(request: NextRequest) {
  const sessionUser = await getRequestUser(request);
  const body = await request.json();
  const { firstName, lastName } = updateSchema.parse(body);

  await prisma.user.update({
    select: { id: true, email: true, firstName: true, lastName: true, isActive: true },
    where: { id: sessionUser.id },
    data: {
      firstName: firstName,
      lastName: lastName,
      groups: {
        updateMany: {
          where: {},
          data: { updatedAt: new Date() },
        },
      },
    },
  });

  const refreshCollection = collection(firestore, "refresh");
  addDoc(refreshCollection, {});

  return NextResponse.json({}, { status: 200 });
}

const updateSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().optional(),
});

const createSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty(),
  firstName: z.string().nonempty(),
  lastName: z.string().optional(),
});
