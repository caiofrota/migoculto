import { EnumGroupStatus } from "@prisma/enums";
import { BaseError } from "errors";
import { withErrorHandling } from "errors/handler";
import { addDoc, collection } from "firebase/firestore";
import { prisma } from "lib/database";
import { firestore } from "lib/firebase";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../../session/authentication";

export const POST = await withErrorHandling(joinGroup);

async function joinGroup(request: NextRequest, ctx: RouteContext<"/api/v1/groups/[groupId]/leave">) {
  const user = await getRequestUser(request);
  const pathParams = await ctx.params;
  const { groupId } = path.parse(pathParams);

  const existingMember = await prisma.member.findUnique({
    include: { group: true },
    where: { groupAndUser: { groupId, userId: user.id } },
  });
  if (!existingMember) {
    throw new BaseError({
      name: "NotAMember",
      message: "Você não é membro deste grupo.",
      action: "Por favor, verifique se você já está no grupo antes de tentar sair.",
    });
  }
  if (existingMember.group.status !== EnumGroupStatus.OPEN) {
    throw new BaseError({
      name: "CannotLeaveClosedGroup",
      message: "Você não pode sair de um grupo fechado.",
      action: "Por favor, entre em contato com o administrador do grupo para sair.",
    });
  }
  if (existingMember.group.ownerId !== user.id) {
    throw new BaseError({
      name: "OwnerCannotLeaveGroup",
      message: "O proprietário do grupo não pode sair do grupo.",
      action: "Por favor, transfira a propriedade do grupo antes de tentar sair.",
    });
  }
  await prisma.member.delete({ where: { id: existingMember.id } });
  await prisma.group.update({
    where: { id: groupId },
    data: { updatedAt: new Date() },
  });

  const refreshCollection = collection(firestore, "refresh");
  addDoc(refreshCollection, {});

  return NextResponse.json({});
}

const path = z.object({
  groupId: z.coerce.number(),
});
