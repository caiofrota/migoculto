import bcrypt from "bcryptjs";
import { UnauthorizedError } from "errors";
import { withErrorHandling } from "errors/handler";
import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { authenticateWithApple } from "../authentication";

const appleClient = jwksClient({ jwksUri: "https://appleid.apple.com/auth/keys" });

function getAppleKey(header: JwtHeader, callback: SigningKeyCallback) {
  appleClient.getSigningKey(header.kid, function (_, key) {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export interface AppleIdTokenPayload extends JwtPayload {
  sub: string;
  email?: string;
  email_verified?: "true" | "false";
  is_private_email?: "true" | "false";
  auth_time?: number;
}

export async function verifyAppleIdentityToken(identityToken: string): Promise<AppleIdTokenPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      identityToken,
      getAppleKey,
      {
        algorithms: ["RS256"],
        issuer: "https://appleid.apple.com",
        audience: process.env.APPLE_CLIENT_ID,
      },
      (err, decoded) => {
        if (err || !decoded) return reject(err || new Error("Invalid token"));

        resolve(decoded as AppleIdTokenPayload);
      },
    );
  });
}

async function handlePost(req: NextRequest) {
  const startMs = Date.now();
  try {
    const body = await req.json();
    const { identityToken, givenName, familyName } = schema.parse(body);
    const appleUser = await verifyAppleIdentityToken(identityToken);
    if (!appleUser.sub || !appleUser.email) {
      throw new UnauthorizedError();
    }
    console.log(appleUser);

    const tokens = await authenticateWithApple(appleUser.email, appleUser.sub, { givenName: givenName, familyName: familyName });

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
  identityToken: z.string().nonempty(),
  givenName: z.string().or(z.undefined()),
  familyName: z.string().or(z.undefined()),
});
