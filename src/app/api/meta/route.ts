import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all tier data
export async function GET() {
  try {
    const tierData = await prisma.brawlerTier.findMany({
      orderBy: [
        { tier: 'asc' },
        { position: 'asc' }
      ]
    });

    return NextResponse.json(tierData);
  } catch (error) {
    console.error('Error fetching tier data:', error);
    return NextResponse.json({ error: 'Failed to fetch tier data' }, { status: 500 });
  }
}

// POST/PUT - Update tier for a brawler
export async function POST(request: Request) {
  try {
    const { brawlerId, tier, position } = await request.json();

    const tierData = await prisma.brawlerTier.upsert({
      where: { brawlerId },
      update: { tier, position },
      create: { brawlerId, tier, position }
    });

    return NextResponse.json(tierData);
  } catch (error) {
    console.error('Error updating tier:', error);
    return NextResponse.json({ error: 'Failed to update tier' }, { status: 500 });
  }
}

// DELETE - Remove brawler from tier list
export async function DELETE(request: Request) {
  try {
    const { brawlerId } = await request.json();

    await prisma.brawlerTier.delete({
      where: { brawlerId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tier:', error);
    return NextResponse.json({ error: 'Failed to delete tier' }, { status: 500 });
  }
}
