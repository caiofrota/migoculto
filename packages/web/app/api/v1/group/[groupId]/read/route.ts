import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../../session/authentication";

async function handlePost(request: NextRequest, ctx: RouteContext<"/api/v1/group/[groupId]/message">) {
  const user = await getRequestUser(request);
  const params = await ctx.params;
  const data = schema.parse(params);

  const result = await prisma.member.update({
    where: { groupAndUser: { groupId: data.groupId, userId: user.id } },
    data: { lastReadAt: new Date() },
  });

  return NextResponse.json(result, { status: 200 });
}

export const POST = await withErrorHandling(handlePost);

const schema = z.object({
  groupId: z.coerce.number(),
});
