import { BaseError, ForbiddenError } from "errors";
import { withErrorHandling } from "errors/handler";
import { addDoc, collection } from "firebase/firestore";
import { prisma } from "lib/database";
import { firestore } from "lib/firebase";
import { sendGroupDrawnNotifications } from "lib/notification";
import { drawSecretFriends } from "model/group";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../../session/authentication";

async function handlePost(request: NextRequest, ctx: RouteContext<"/api/v1/groups/[groupId]/draw">) {
  const user = await getRequestUser(request);
  const p = await ctx.params;
  const { groupId } = schema.parse(p);

  const group = await prisma.group.findUnique({ include: { members: true }, where: { id: groupId } });
  if (!group) throw new BaseError({ message: "Grupo não encontrado.", statusCode: 404, name: "GroupNotFoundError" });
  if (group.ownerId !== user?.id) {
    throw new ForbiddenError({
      message: "Somente o dono do grupo pode sortear os amigos secretos.",
      action: "Por favor, entre em contato com o dono do grupo para realizar o sorteio.",
    });
  }

  const drawnGroup = drawSecretFriends(group.members.map((member) => member.id));
  const membersUpdate = Array.from(drawnGroup?.entries() ?? []).map(([memberId, assignedUserId]) => ({
    where: { id: memberId },
    data: { assignedUserId: group.members.find((m) => m.id === assignedUserId)?.userId },
  }));

  await prisma.$transaction([
    ...membersUpdate.map((memberUpdate) => prisma.member.update(memberUpdate)),
    prisma.group.update({ where: { id: group.id }, data: { updatedAt: new Date(), status: "DRAWN" } }),
    prisma.message.deleteMany({ where: { groupId: group.id, receiverId: { not: null } } }),
  ]);
  const updatedGroup = await prisma.group.findUnique({
    where: { id: groupId },
    include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true, updatedAt: true, devices: true } } } } },
  });

  if (updatedGroup) {
    await sendGroupDrawnNotifications(
      updatedGroup,
      updatedGroup.members
        .filter((m) => m.userId !== user.id)
        .map((m) => m.user.devices)
        .flat(),
    );
  }
  const refreshCollection = collection(firestore, "refresh");
  addDoc(refreshCollection, {});

  return NextResponse.json(updatedGroup, { status: 200 });
}

export const POST = await withErrorHandling(handlePost);

const schema = z.object({
  groupId: z.coerce.number(),
});
