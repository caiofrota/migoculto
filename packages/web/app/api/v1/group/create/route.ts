import { withErrorHandling } from "errors/handler";
import { prisma } from "lib/database";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getRequestUser } from "../../session/authentication";

async function handlePost(request: NextRequest) {
  const user = await getRequestUser(request);
  const params = await request.json();
  const data = schema.parse(params);

  const result = await prisma.group.create({
    data: {
      ownerId: user.id,
      password: data.password,
      name: data.name,
      description: data.description,
      eventDate: data.eventDate,
      additionalInfo: data.additionalInfo,
      location: data.location,
      members: {
        create: {
          userId: user.id,
        },
      },
    },
    include: { members: { include: { user: { omit: { email: true, password: true } } } } },
  });

  return NextResponse.json(result, { status: 200 });
}

export const POST = await withErrorHandling(handlePost);

const schema = z.object({
  name: z.string().min(1).max(100),
  password: z.string().min(4).max(20),
  description: z.string().max(500).optional(),
  eventDate: z.coerce.date(),
  additionalInfo: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
});
