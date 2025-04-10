import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'

export async function POST() {
  try {
    // Find admin user
    const admin = await prisma.user.findFirst({
      where: {
        role: 'admin',
      },
    })

    if (!admin) {
      return NextResponse.json(
        { message: 'Admin user not found' },
        { status: 404 }
      )
    }

    // Reset admin password
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const updatedAdmin = await prisma.user.update({
      where: {
        id: admin.id,
      },
      data: {
        password: hashedPassword,
      },
    })

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = updatedAdmin

    return NextResponse.json(adminWithoutPassword)
  } catch (error) {
    console.error('Reset error:', error)
    return NextResponse.json(
      { message: 'Error resetting admin password' },
      { status: 500 }
    )
  }
} 