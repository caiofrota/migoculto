import { NextRequest, NextResponse } from "next/server";
import { authenticateWithRefreshToken } from "../authentication";
import { UnauthorizedError } from "errors";
import { withErrorHandling } from "errors/handler";

async function handlePost(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    throw new UnauthorizedError({
      message: "Nenhum token de atualização fornecido.",
      action: "Por favor, forneça um token de atualização válido.",
    });
  }

  const tokens = await authenticateWithRefreshToken(refreshToken);
  const res = NextResponse.json({ status: "ok" }, { status: 200 });

  res.cookies.set("access_token", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.cookies.set("refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}

export const POST = await withErrorHandling(handlePost);
