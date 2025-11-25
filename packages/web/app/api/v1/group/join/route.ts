import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../session/authentication";

async function handlePost(request: NextRequest) {
  const user = await getRequestUser(request);
  const { groupId, password } = schema.parse(await request.json());

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

export const POST = await withErrorHandling(handlePost);

const schema = z.object({
  groupId: z.coerce.number(),
  password: z.string().min(1),
});
