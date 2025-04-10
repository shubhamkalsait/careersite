import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const job = await prisma.job.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    })
    return NextResponse.json(job)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating job' },
      { status: 500 }
    )
  }
} 