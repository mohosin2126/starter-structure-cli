import bcrypt from "bcryptjs";

import { prisma } from "../../../../lib/prisma";

export async function POST(request) {
  const body = await request.json();

  if (!body.email || !body.password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase() }
  });

  if (existing) {
    return Response.json({ error: "User already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      name: body.name || body.email.split("@")[0],
      email: body.email.toLowerCase(),
      passwordHash
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  return Response.json({ user }, { status: 201 });
}
