import { withErrorHandling } from "errors/handler";
import { addDoc, collection } from "firebase/firestore";
import { prisma } from "lib/database";
import { firestore } from "lib/firebase";
import { sendWishlistUpdateNotifications } from "lib/notification";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../../../../session/authentication";

export const DELETE = await withErrorHandling(deleteWishlistItem);

async function deleteWishlistItem(request: NextRequest, ctx: RouteContext<"/api/v1/groups/[groupId]/wishlist/remove/[itemId]">) {
  const user = await getRequestUser(request);
  const pathParams = await ctx.params;
  const { groupId, itemId } = path.parse(pathParams);

  await prisma.wishlist.delete({ where: { id: itemId, userId: user.id, groupId } });
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
  itemId: z.coerce.number(),
});
