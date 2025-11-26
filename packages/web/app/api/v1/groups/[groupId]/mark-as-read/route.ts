import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../../session/authentication";

export const POST = await withErrorHandling(updateGroupLastReadAt);

async function updateGroupLastReadAt(request: NextRequest, ctx: RouteContext<"/api/v1/groups/[groupId]/mark-as-read">) {
  const user = await getRequestUser(request);
  const pathParams = await ctx.params;
  const data = path.parse(pathParams);

  const result = await prisma.member.update({
    where: { groupAndUser: { groupId: data.groupId, userId: user.id } },
    data: { lastReadAt: new Date() },
  });

  return NextResponse.json(result, { status: 200 });
}

const path = z.object({
  groupId: z.coerce.number(),
});
