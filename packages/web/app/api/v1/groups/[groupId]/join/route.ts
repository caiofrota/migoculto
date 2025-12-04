import { withErrorHandling } from "errors/handler";
import { addDoc, collection } from "firebase/firestore";
import { prisma } from "lib/database";
import { firestore } from "lib/firebase";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../../session/authentication";

export const POST = await withErrorHandling(joinGroup);

async function joinGroup(request: NextRequest, ctx: RouteContext<"/api/v1/groups/[groupId]/join">) {
  const user = await getRequestUser(request);
  const pathParams = await ctx.params;
  const { groupId } = path.parse(pathParams);
  const { password } = body.parse(await request.json());

  const group = await prisma.group.update({
    include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true } } } } },
    where: { id: groupId, password },
    data: {
      members: {
        create: {
          userId: user.id,
          joinedAt: new Date(),
        },
      },
      updatedAt: new Date(),
    },
  });
  const member = group.members.find((member) => member.userId === user.id)!;

  const refreshCollection = collection(firestore, "refresh");
  addDoc(refreshCollection, {});

  return NextResponse.json({
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
    lastMessageAt: null,
    unreadCount: 0,
    myAssignedUserId: member.assignedUserId,
    assignedOfUserId: null,
    myMemberId: member.id,
    lastUpdate: new Date(),
    members: group.members.map((member) => ({
      id: member.id,
      userId: member.userId,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      isConfirmed: member.isConfirmed,
      wishlistCount: 5,
    })),
    lastMessage: null,
    groupMessages: [],
    messagesAsGiftSender: [],
    messagesAsGiftReceiver: [],
  });
}

const path = z.object({
  groupId: z.coerce.number(),
});

const body = z.object({
  password: z.string().min(1),
});
