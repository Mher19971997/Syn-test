import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: any) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const url = new URL(req.url);

  const industryName = url.searchParams.get("industryName");
  const filters: { name?: { contains: string; mode: "insensitive" } } = {};

  if (industryName) {
    filters.name = {
      contains: industryName,
      mode: "insensitive",
    };
  }
  try {
    const industries = await prisma.industry.findMany({
      where: filters,
      include: {
        selectedIndustries: true,
      },
    });

    return NextResponse.json({ industries });
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { industryIds, userId } = body;

    if (!industryIds || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const selectedIndustries = industryIds.map((industryId: string) => ({
      userId,
      industryId,
    }));

    await prisma.selectedUserIndustry.createMany({
      data: selectedIndustries,
    });

    return NextResponse.json({ message: "Industries selected successfully" });
  } catch (error) {
    console.error("Ошибка при создании:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { industryId, userId } = body;

    if (!industryId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await prisma.selectedUserIndustry.deleteMany({
      where: {
        userId: +userId,
        industryId,
      },
    });

    return NextResponse.json({ message: "Industry removed successfully" });
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
