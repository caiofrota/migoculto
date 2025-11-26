import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../../session/authentication";

export const POST = await withErrorHandling(joinGroup);

async function joinGroup(request: NextRequest, ctx: RouteContext<"/api/v1/groups/[groupId]/join">) {
  const user = await getRequestUser(request);
  const pathParams = await ctx.params;
  const { groupId } = path.parse(pathParams);
  const { password } = body.parse(await request.json());

  const result = await prisma.group.update({
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

  return NextResponse.json(result, { status: 200 });
}

const path = z.object({
  groupId: z.coerce.number(),
});

const body = z.object({
  password: z.string().min(1),
});
