import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import prisma from '@/lib/db'
import SignOutButton from '@/components/SignOutButton'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login')
  }

  // Get pending student registrations count
  const pendingStudentsCount = await prisma.user.count({
    where: {
      role: 'student',
      status: 'pending',
    },
  })

  // Get total students count
  const totalStudentsCount = await prisma.user.count({
    where: {
      role: 'student',
    },
  })

  // Get total jobs count
  const totalJobsCount = await prisma.job.count()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white" suppressHydrationWarning>
      <div className="py-10">
        <header className="border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                Admin Dashboard
              </h1>
              <span className="text-sm text-gray-400">Welcome back, {session.user.name}!</span>
            </div>
            <SignOutButton />
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl rounded-lg p-6 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Link
                    href="/dashboard/post-job"
                    className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">Post New Job</h3>
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-400">Create a new job posting for students to apply</p>
                  </Link>

                  <Link
                    href="/dashboard/pending-students"
                    className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold text-white">Pending Students</h3>
                        {pendingStudentsCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {pendingStudentsCount} new
                          </span>
                        )}
                      </div>
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-400">Review and approve student registrations</p>
                  </Link>

                  <Link
                    href="/dashboard/add-student"
                    className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">Add Student</h3>
                      <div className="p-2 rounded-lg bg-pink-500/10">
                        <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-400">Manually add a new student to the system</p>
                  </Link>

                  <Link
                    href="/dashboard/students"
                    className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">View Students</h3>
                      <div className="p-2 rounded-lg bg-yellow-500/10">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-400">View and manage all registered students</p>
                  </Link>

                  <Link
                    href="/dashboard/applications"
                    className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">View Applications</h3>
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-400">Review and manage job applications</p>
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                    <h3 className="text-lg font-medium mb-4 text-blue-400">Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Pending Registrations</span>
                        <span className="text-xl font-semibold text-white">{pendingStudentsCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Students</span>
                        <span className="text-xl font-semibold text-white">{totalStudentsCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Jobs Posted</span>
                        <span className="text-xl font-semibold text-white">{totalJobsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 