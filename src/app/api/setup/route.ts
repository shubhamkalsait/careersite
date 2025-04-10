import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    const email = 'admin@example.com'
    const password = 'admin123'
    const name = 'Admin User'

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
      },
    })

    return NextResponse.json({ message: 'Admin user created successfully', user })
  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { error: 'Error creating admin user' },
      { status: 500 }
    )
  }
} 