import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "Email already taken" }, { status: 400 });
  }

  // Hash the password and create the new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({ data: { email, password: hashedPassword } });

  // Return a success response with user data or token
  return NextResponse.json({ message: "User created successfully", user: newUser });
}
