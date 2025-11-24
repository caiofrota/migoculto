import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../session/authentication";

async function handleGet(request: NextRequest, ctx: RouteContext<"/api/v1/[groupId]/draw">) {
  const user = await getRequestUser(request);

  const memberships = await prisma.member.findMany({
    where: { userId: user?.id },
    include: { group: true },
  });

  const result = await Promise.all(
    memberships.map(async (member) => {
      const lastRead = member.lastReadAt ?? new Date(0);
      const messages = await prisma.message.findMany({
        where: {
          groupId: member.groupId,
          OR: [{ receiverId: null }, { receiverId: member.userId }],
        },
        orderBy: { createdAt: "asc" },
      });
      const unread = messages.filter((message) => message.createdAt > lastRead);
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

      return {
        id: member.groupId,
        password: member.group.password,
        name: member.group.name,
        description: member.group.description,
        eventDate: member.group.eventDate,
        additionalInfo: member.group.additionalInfo,
        location: member.group.location,
        ownerId: member.group.ownerId,
        status: member.group.status,
        archivedAt: member.archivedAt,
        isOwner: member.group.ownerId === member.userId,
        isArchived: member.archivedAt !== null,
        unreadCount: unread.length,
        messages: messages.map((msg) => ({
          id: msg.id,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          content: msg.content,
          createdAt: msg.createdAt,
        })),
        unreadMessages: unread.map((msg) => ({
          id: msg.id,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          content: msg.content,
          createdAt: msg.createdAt,
        })),
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              senderId: lastMessage.senderId,
              receiverId: lastMessage.receiverId,
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
            }
          : null,
      };
    }),
  );

  return NextResponse.json(result, { status: 200 });
}

export const GET = await withErrorHandling(handleGet);

const schema = z.object({
  groupId: z.coerce.number(),
});
