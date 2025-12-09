import { BaseError } from "errors";
import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../session/authentication";

async function handleGet(request: NextRequest, ctx: RouteContext<"/api/v1/groups/[groupId]/mark-as-read">) {
  const user = await getRequestUser(request);
  const p = await ctx.params;
  const { groupId } = schema.parse(p);

  const group = await prisma.group.findUnique({
    include: { members: { include: { user: { omit: { password: true, email: true } } } }, wishlists: true },
    where: { id: groupId },
  });
  if (!group || !group.members.some((member) => member.userId === user?.id)) {
    throw new BaseError({ message: "Grupo não encontrado.", statusCode: 404, name: "GroupNotFoundError" });
  }

  const membership = group.members.find((member) => member.userId === user.id);
  const myAssigned = group.members.find((member) => member.userId === membership?.assignedUserId)?.user;
  const assignedOf = group.members.find((member) => member.assignedUserId === user.id)?.user;

  const messages = (
    await prisma.message.findMany({
      where: {
        groupId: group.id,
        OR: [{ receiverId: null }, { receiverId: user.id }, { senderId: user.id }],
      },
      include: { sender: { select: { firstName: true, lastName: true } }, receiver: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "asc" },
    })
  ).filter((message) => message.createdAt > (membership?.createdAt || new Date()));
  const lastRead = membership?.lastReadAt ?? new Date(0);
  const unread = messages.filter((message) => message.createdAt > lastRead);
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  const lastGroupUpdate = group.updatedAt;
  const lastMessageUpdate = lastMessage?.createdAt ?? new Date(0);
  const lastUpdate = lastGroupUpdate > lastMessageUpdate ? lastGroupUpdate : lastMessageUpdate;

  const res = {
    id: group.id,
    name: group.name,
    description: group.description,
    location: group.location,
    eventDate: group.eventDate,
    additionalInfo: group.additionalInfo,
    ownerId: group.ownerId,
    status: group.status,
    password: group.password,
    createdAt: group.createdAt,
    isOwner: group.ownerId === user?.id,
    isConfirmed: membership?.isConfirmed || false,
    lastRead: membership?.lastReadAt || null,
    myAssignedUserId: membership?.assignedUserId || null,
    assignedOfUserId: assignedOf?.id || null,
    myMemberId: membership?.id || null,
    userId: membership?.userId,
    archivedAt: membership?.archivedAt || null,
    updatedAt: group.updatedAt,
    lastMessageAt: lastMessage ? lastMessage.createdAt : null,
    unreadCount: unread.length,
    lastUpdate,
    membership: membership,
    members: group.members.map((member) => ({
      id: member.id,
      userId: member.userId,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      assignedUserId: group.status === "CLOSED" || user.id === member.userId ? member.assignedUserId : null,
      isConfirmed: member.isConfirmed,
      wishlistCount: group.wishlists.filter((w) => w.userId === member.userId).length,
      wishlist: group.wishlists
        .filter((w) => w.userId === member.userId)
        .map((w) => ({
          id: w.id,
          name: w.name,
          url: w.url,
          description: w.description,
          createdAt: w.createdAt,
          updatedAt: w.updatedAt,
        })),
    })),
    lastMessage: lastMessage
      ? {
          id: lastMessage.id,
          sender:
            lastMessage.senderId === membership?.userId
              ? "Você"
              : !lastMessage.receiverId
                ? `${lastMessage.sender.firstName} ${lastMessage.sender.lastName}`
                : lastMessage.senderId === membership?.assignedUserId
                  ? "Seu amigo secreto"
                  : "Quem te tirou",
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          isMine: lastMessage.senderId === membership?.userId,
        }
      : null,
    groupMessages: messages
      .filter((m) => m.receiverId === null)
      .map((msg) => ({
        id: msg.id,
        sender: msg.senderId === user.id ? "Você" : `${msg.sender.firstName} ${msg.sender.lastName}`,
        content: msg.content,
        createdAt: msg.createdAt,
        isMine: msg.senderId === user.id,
      })),
    messagesAsGiftSender: messages
      .filter(
        (m) => (m.senderId === user.id && m.receiverId === myAssigned?.id) || (m.senderId === myAssigned?.id && m.receiverId === user.id),
      )
      .map((msg) => ({
        id: msg.id,
        sender:
          msg.senderId === user.id
            ? "Você"
            : group.status === "CLOSED"
              ? myAssigned?.firstName + " " + myAssigned?.lastName
              : "Quem eu tirei",
        receiver:
          msg.receiverId === user.id
            ? "Você"
            : group.status === "CLOSED"
              ? myAssigned?.firstName + " " + myAssigned?.lastName
              : "Quem eu tirei",
        content: msg.content,
        createdAt: msg.createdAt,
        isMine: msg.senderId === user.id,
      })),
    messagesAsGiftReceiver: messages
      .filter(
        (m) => (m.senderId === user.id && m.receiverId === assignedOf?.id) || (m.senderId === assignedOf?.id && m.receiverId === user.id),
      )
      .map((msg) => ({
        id: msg.id,
        sender:
          msg.senderId === user.id
            ? "Eu"
            : group.status === "CLOSED"
              ? assignedOf?.firstName + " " + assignedOf?.lastName
              : "Quem tirou você",
        receiver:
          msg.receiverId === user.id
            ? "Eu"
            : group.status === "CLOSED"
              ? assignedOf?.firstName + " " + assignedOf?.lastName
              : "Quem tirou você",
        content: msg.content,
        createdAt: msg.createdAt,
        isMine: msg.senderId === user.id,
      })),
  };
  return NextResponse.json(res);
}

export const GET = await withErrorHandling(handleGet);

const schema = z.object({
  groupId: z.coerce.number(),
});
