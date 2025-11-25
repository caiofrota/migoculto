import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../authentication";

async function handlePost(req: NextRequest) {
  const user = await getRequestUser(req);
  const body = await req.json();
  const data = schema.parse(body);
  if (user && data.pushNotificationToken) {
    await prisma.device.delete({
      where: { pushNotificationToken: data.pushNotificationToken },
    });
  }
  return NextResponse.json({ user });
}

export const POST = await withErrorHandling(handlePost);

const schema = z.object({
  pushNotificationToken: z.string().optional(),
});
