import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/db'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const userId = formData.get('userId')

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: 'approved' },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Error approving student:', error)
    return NextResponse.json({ error: 'Failed to approve student' }, { status: 500 })
  }
} 