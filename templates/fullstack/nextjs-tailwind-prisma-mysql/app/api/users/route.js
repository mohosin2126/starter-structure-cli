import { prisma } from "../../../lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return Response.json({ users });
}

export async function POST(request) {
  const body = await request.json();

  if (!body.name || !body.email) {
    return Response.json({ error: "Name and email are required." }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email.toLowerCase(),
      role: body.role || "user"
    }
  });

  return Response.json({ user }, { status: 201 });
}
