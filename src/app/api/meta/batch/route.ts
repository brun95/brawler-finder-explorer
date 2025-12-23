import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Batch update tier positions
export async function POST(request: Request) {
  try {
    const { updates } = await request.json();
    // updates: Array<{ brawlerId, tier, position }>

    // Use a transaction to update all at once
    await prisma.$transaction(
      updates.map((update: { brawlerId: number; tier: string; position: number }) =>
        prisma.brawlerTier.upsert({
          where: { brawlerId: update.brawlerId },
          update: { tier: update.tier, position: update.position },
          create: {
            brawlerId: update.brawlerId,
            tier: update.tier,
            position: update.position
          }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error batch updating tiers:', error);
    return NextResponse.json({ error: 'Failed to batch update tiers' }, { status: 500 });
  }
}
