import { BaseError } from "errors";
import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { sendGroupMessageNotifications, sendInboxMessageNotifications } from "lib/notification";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../../session/authentication";

async function handlePost(request: NextRequest, ctx: RouteContext<"/api/v1/group/[groupId]/message">) {
  const user = await getRequestUser(request);
  const p = await ctx.params;
  const { groupId } = schema.parse(p);
  const { content, receiverId } = body.parse(await request.json());

  const group = await prisma.group.findUnique({
    include: { members: { include: { user: { select: { id: true, devices: true } } } } },
    where: { id: groupId },
  });
  if (!group || !group.members.some((member) => member.userId === user?.id)) {
    throw new BaseError({ message: "Grupo não encontrado.", statusCode: 404, name: "GroupNotFoundError" });
  }
  const message = await prisma.message.create({
    data: {
      content,
      groupId,
      senderId: user.id,
      receiverId: receiverId || null,
    },
  });

  if (!receiverId) {
    sendGroupMessageNotifications(
      group,
      group.members
        .filter((m) => m.userId !== user?.id)
        .map((m) => m.user.devices)
        .flat(),
    );
  } else {
    sendInboxMessageNotifications(
      group,
      group.members
        .filter((m) => m.userId === receiverId)
        .map((m) => m.user.devices)
        .flat(),
    );
  }
  return NextResponse.json({
    message,
  });
}

export const POST = await withErrorHandling(handlePost);

const schema = z.object({
  groupId: z.coerce.number(),
});

const body = z.object({
  content: z.string().min(1).max(1000),
  receiverId: z.number().nullable().optional(),
});
