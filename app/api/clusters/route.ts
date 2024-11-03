import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const clusters = await prisma.cluster_info.findMany();
		return NextResponse.json(clusters);
	} catch (error) {
		console.error('Error fetching players:', error);
		return NextResponse.json(
			{ error: 'Error fetching players' },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
