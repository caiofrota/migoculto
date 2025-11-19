import { BaseError, ForbiddenError } from "errors";
import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { drawSecretFriends } from "model/group";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../session/authentication";

async function handlePost(request: NextRequest, ctx: RouteContext<"/api/v1/[groupId]/draw">) {
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

  return NextResponse.json(Array.from(drawnGroup?.entries() ?? []), { status: 200 });
}

export const POST = await withErrorHandling(handlePost);

const schema = z.object({
  groupId: z.coerce.number(),
});
