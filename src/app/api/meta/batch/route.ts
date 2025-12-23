import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Batch update multiple brawlers
export async function POST(request: Request) {
  try {
    const { updates } = await request.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: 'Updates must be an array' }, { status: 400 });
    }

    // Use a transaction to update all brawlers at once
    await prisma.$transaction(
      updates.map((update) =>
        prisma.brawlerTier.upsert({
          where: { brawlerId: update.brawlerId },
          update: {
            tier: update.tier,
            position: update.position,
            updatedAt: new Date()
          },
          create: {
            brawlerId: update.brawlerId,
            tier: update.tier,
            position: update.position
          }
        })
      )
    );

    return NextResponse.json({ success: true, updated: updates.length });
  } catch (error) {
    console.error('Error batch updating tier data:', error);
    return NextResponse.json({ error: 'Failed to batch update tier data' }, { status: 500 });
  }
}
