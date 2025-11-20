import bcrypt from "bcryptjs";
import { UnauthorizedError } from "errors";
import { withErrorHandling } from "errors/handler";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { authenticateWithCredentials } from "./authentication";

async function handlePost(req: NextRequest) {
  const startMs = Date.now();
  try {
    const body = await req.json();
    const { username, password } = schema.parse(body);

    const tokens = await authenticateWithCredentials(username, password);

    const res = NextResponse.json({ access_token: tokens.accessToken, refresh_token: tokens.refreshToken }, { status: 200 });

    res.cookies.set("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookies.set("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res;
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
  username: z.email().nonempty(),
  password: z.string().nonempty(),
});
