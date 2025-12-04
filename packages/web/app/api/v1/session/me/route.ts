import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../authentication";

async function handlePost(req: NextRequest) {
  const user = await getRequestUser(req);
  const body = await req.json();
  const data = schema.parse(body);
  if (data.pushNotificationToken) {
    await prisma.device.upsert({
      where: { pushNotificationToken: data.pushNotificationToken },
      create: {
        userId: user.id,
        pushNotificationToken: data.pushNotificationToken,
        platform: data.platform ?? "",
        appVersion: data.appVersion || "",
        runtimeVersion: data.runtimeVersion,
        appRevision: data.appRevision,
        deviceType: data.deviceType as any,
        deviceName: data.deviceName,
        osName: data.osName,
        osVersion: data.osVersion,
        platformVersion: String(data.platformVersion) || "",
      },
      update: {
        userId: user.id,
        platform: data.platform,
        appVersion: data.appVersion,
        runtimeVersion: data.runtimeVersion,
        appRevision: data.appRevision,
        deviceType: data.deviceType as any,
        deviceName: data.deviceName,
        osName: data.osName,
        osVersion: data.osVersion,
        platformVersion: String(data.platformVersion) || "",
        updatedAt: new Date(),
      },
    });
  }
  return NextResponse.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
  });
}

export const POST = await withErrorHandling(handlePost);

const schema = z.object({
  platform: z.string().optional(),
  platformVersion: z.string().optional().or(z.coerce.number()),
  runtimeVersion: z.string().optional(),
  appVersion: z.string().optional(),
  appRevision: z.coerce.number().optional(),
  pushNotificationToken: z.string().optional().nullable(),
  deviceType: z.string().optional(),
  deviceName: z.string().optional(),
  osName: z.string().optional(),
  osVersion: z.string().optional(),
});
