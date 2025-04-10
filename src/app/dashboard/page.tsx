import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import prisma from '@/lib/db'
import SignOutButton from '@/components/SignOutButton'

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-medium mb-4 text-green-400">Quick Actions</h3>
                    <div className="space-y-3">
                      <a
                        href="/dashboard/pending-students"
                        className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>View Pending Registrations</span>
                        {pendingStudentsCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {pendingStudentsCount} new
                          </span>
                        )}
                      </a>
                      <a
                        href="/dashboard/students"
                        className="block w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>View All Students</span>
                      </a>
                      <a
                        href="/dashboard/post-job"
                        className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Post New Job</span>
                      </a>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-medium mb-4 text-blue-400">Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Pending Registrations</span>
                        <span className="text-xl font-semibold">{pendingStudentsCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Students</span>
                        <span className="text-xl font-semibold">{totalStudentsCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Jobs Posted</span>
                        <span className="text-xl font-semibold">0</span>
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