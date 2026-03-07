import bcrypt from "bcryptjs";

import { connectToDatabase } from "../../../lib/mongoose";
import User from "../../../models/User";

export async function GET() {
  await connectToDatabase();

  const users = await User.find({}, "name email role createdAt").sort({ createdAt: -1 }).limit(10).lean();
  return Response.json({ users });
}

export async function POST(request) {
  await connectToDatabase();

  const body = await request.json();

  if (!body.name || !body.email || !body.password) {
    return Response.json({ error: "Name, email, and password are required." }, { status: 400 });
  }

  const existing = await User.findOne({ email: body.email.toLowerCase() });
  if (existing) {
    return Response.json({ error: "User already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(body.password, 10);
  const user = await User.create({
    name: body.name,
    email: body.email.toLowerCase(),
    role: body.role || "user",
    passwordHash
  });

  return Response.json(
    {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    },
    { status: 201 }
  );
}
