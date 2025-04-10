import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'admin',
      },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 400 }
      )
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        status: 'approved', // Admin is automatically approved
      },
    })

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin

    return NextResponse.json(adminWithoutPassword)
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { message: 'Error creating admin user' },
      { status: 500 }
    )
  }
} 