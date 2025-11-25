import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "../../session/authentication";

async function handleGet(request: NextRequest) {
  const user = await getRequestUser(request);

  const memberships = await prisma.member.findMany({
    where: { userId: user?.id },
    include: {
      group: { include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true } } } } } },
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  const result = await Promise.all(
    memberships.map(async (member) => {
      const lastRead = member.lastReadAt ?? new Date(0);
      const messages = await prisma.message.findMany({
        include: { sender: { select: { firstName: true, lastName: true } }, receiver: { select: { firstName: true, lastName: true } } },
        where: {
          groupId: member.groupId,
          OR: [{ receiverId: null }, { receiverId: user.id }, { senderId: user.id }],
        },
        orderBy: { createdAt: "asc" },
      });
      const group = member.group;
      const unread = messages.filter((message) => message.createdAt > lastRead);
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
      const assignedOf = group.members.find((member) => member.assignedUserId === user.id);

      const lastGroupUpdate = group.updatedAt;
      const lastMessageUpdate = lastMessage?.createdAt ?? new Date(0);
      const lastUpdate = lastGroupUpdate > lastMessageUpdate ? lastGroupUpdate : lastMessageUpdate;

      return {
        id: member.groupId,
        userId: member.userId,
        password: group.password,
        name: group.name,
        description: group.description,
        eventDate: group.eventDate,
        additionalInfo: group.additionalInfo,
        location: group.location,
        ownerId: group.ownerId,
        status: group.status,
        archivedAt: member.archivedAt,
        isConfirmed: member.isConfirmed,
        lastRead: member.lastReadAt,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        isOwner: group.ownerId === member.userId,
        lastMessageAt: lastMessage ? lastMessage.createdAt : null,
        unreadCount: unread.length,
        myAssignedUserId: member.assignedUserId,
        assignedOfUserId: assignedOf?.userId,
        myMemberId: member.id,
        lastUpdate,
        members: member.group.members.map((member) => ({
          id: member.id,
          userId: member.userId,
          firstName: member.user.firstName,
          lastName: member.user.lastName,
          isConfirmed: member.isConfirmed,
          wishlistCount: 5,
        })),
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              sender:
                lastMessage.senderId === member.userId
                  ? "Eu"
                  : !lastMessage.receiverId
                    ? `${lastMessage.sender.firstName} ${lastMessage.sender.lastName}`
                    : lastMessage.senderId === member.assignedUserId
                      ? "Seu amigo secreto"
                      : "Quem te tirou",
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              isMine: lastMessage.senderId === member.userId,
            }
          : null,
      };
    }),
  );

  return NextResponse.json(
    result.sort((a, b) => {
      const aDate = a.lastMessage?.createdAt ?? a.updatedAt;
      const bDate = b.lastMessage?.createdAt ?? b.updatedAt;
      return bDate.getTime() - aDate.getTime();
    }),
    { status: 200 },
  );
}

export const GET = await withErrorHandling(handleGet);
