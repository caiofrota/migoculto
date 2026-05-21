import { BaseError } from "errors";
import { withErrorHandling } from "errors/handler";
import { addDoc, collection } from "firebase/firestore";
import { prisma } from "@migoculto/db";
import { firestore } from "lib/firebase";
import { sendWishlistUpdateNotifications } from "lib/notification";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../../session/authentication";

export const POST = await withErrorHandling(createWishlistItem);

async function createWishlistItem(request: NextRequest, ctx: RouteContext<"/api/v1/groups/[groupId]/leave">) {
  const user = await getRequestUser(request);
  const pathParams = await ctx.params;
  const { groupId } = path.parse(pathParams);
  const { name, url, description } = body.parse(await request.json());

  const existingMember = await prisma.member.findUnique({
    include: { group: true },
    where: { groupAndUser: { groupId, userId: user.id } },
  });
  if (!existingMember) {
    throw new BaseError({
      name: "NotAMember",
      message: "Você não é membro deste grupo.",
      action: "Por favor, verifique se você já está no grupo antes de tentar adicionar itens à lista de desejos.",
    });
  }
  await prisma.wishlist.create({
    data: {
      userId: user.id,
      groupId,
      name,
      url,
      description,
    },
  });
  const group = await prisma.group.update({
    include: { members: { include: { user: { include: { devices: true } } } } },
    where: { id: groupId },
    data: { updatedAt: new Date() },
  });

  const refreshCollection = collection(firestore, "refresh");
  addDoc(refreshCollection, {});

  const memberUser = group.members.find((m) => m.userId === user.id)?.user;
  const to = group.members
    .filter((member) => member.userId !== user.id)
    .map((member) => member.user.devices)
    .flat()
    .filter((device) => device.pushNotificationToken);
  await sendWishlistUpdateNotifications(group, `${memberUser?.firstName} ${memberUser?.lastName}`, to);

  return NextResponse.json({});
}

const path = z.object({
  groupId: z.coerce.number(),
});

const body = z.object({
  name: z.string(),
  url: z.string().optional(),
  description: z.string().optional(),
});
