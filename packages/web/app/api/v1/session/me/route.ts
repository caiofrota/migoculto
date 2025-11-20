import { withErrorHandling } from "errors/handler";
import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "../authentication";

async function handleGet(req: NextRequest) {
  const user = await getRequestUser(req);
  return NextResponse.json({ user });
}

export const GET = await withErrorHandling(handleGet);
