import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId'); // Retrieve userId from the query params

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const selectedIndustries = await prisma.selectedUserIndustry.findMany({
      where: {
        userId: +userId,
      },
      include: {
        industry: true, 
      },
    });

    return NextResponse.json({ selectedIndustries });
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const body = await req.json(); 

    const { industryId, userId } = body;
    
    if (!industryId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.selectedUserIndustry.create({
      data: {
        industryId,
        userId: +userId
      },
    });

    return NextResponse.json({ message: 'Industries selected successfully' });
  } catch (error) {
    console.error('Ошибка при создании:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { industryId, userId } = body;

    if (!industryId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.selectedUserIndustry.deleteMany({
      where: {
        userId: +userId,
        industryId,
      },
    });

    return NextResponse.json({ message: 'Industry removed successfully' });
  } catch (error) {
    console.error('Ошибка при удалении:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}