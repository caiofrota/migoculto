import { EnumGroupStatus } from "@prisma/enums";
import { BaseError } from "errors";
import { withErrorHandling } from "errors/handler";
import { addDoc, collection } from "firebase/firestore";
import { prisma } from "lib/database";
import { firestore } from "lib/firebase";
import { sendRemoveMemberNotifications } from "lib/notification";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../../../session/authentication";

export const POST = await withErrorHandling(joinGroup);

async function joinGroup(request: NextRequest, ctx: RouteContext<"/api/v1/groups/[groupId]/remove/[memberId]">) {
  const user = await getRequestUser(request);
  const pathParams = await ctx.params;
  const { groupId, memberId } = path.parse(pathParams);

  const existingMember = await prisma.member.findUnique({
    include: { group: true },
    where: { id: memberId, groupId: groupId },
  });
  if (!existingMember) {
    throw new BaseError({
      name: "NotAMember",
      message: "Este membro não pertence a este grupo.",
      action: "Por favor, verifique os detalhes do membro e do grupo antes de tentar removê-lo.",
    });
  }
  if (existingMember.group.status !== EnumGroupStatus.OPEN) {
    throw new BaseError({
      name: "CannotRemoveFromClosedGroup",
      message: "Você não pode remover membros de um grupo fechado.",
    });
  }
  if (existingMember.group.ownerId === existingMember.userId) {
    throw new BaseError({
      name: "OwnerCannotBeRemoved",
      message: "O proprietário do grupo não pode ser removido do grupo.",
    });
  }
  await prisma.member.delete({ where: { id: existingMember.id } });
  await prisma.group.update({
    where: { id: groupId },
    data: { updatedAt: new Date() },
  });

  const refreshCollection = collection(firestore, "refresh");
  addDoc(refreshCollection, {});

  const to = (await prisma.device.findMany({ where: { userId: existingMember.userId } })).filter((device) => device.pushNotificationToken);

  if (to && to.length > 0) {
    await sendRemoveMemberNotifications(existingMember.group, to);
  }

  return NextResponse.json({});
}

const path = z.object({
  groupId: z.coerce.number(),
  memberId: z.coerce.number(),
});
