import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import prisma from '@/lib/db'
import SignOutButton from '@/components/SignOutButton'

export default async function PendingStudentsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login')
  }

  // Get all pending student registrations
  const pendingStudents = await prisma.user.findMany({
    where: {
      role: 'student',
      status: 'pending',
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white" suppressHydrationWarning>
      <div className="py-10">
        <header className="border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                Pending Registrations
              </h1>
              <span className="text-sm text-gray-400">Manage student registrations</span>
            </div>
            <SignOutButton />
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl rounded-lg p-6 border border-gray-700">
                {pendingStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-300">No pending registrations</h3>
                    <p className="mt-1 text-sm text-gray-400">All student registrations have been processed.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingStudents.map((student) => (
                      <div
                        key={student.id}
                        className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{student.name}</h3>
                            <p className="text-gray-400">{student.email}</p>
                            <p className="text-sm text-gray-500">
                              Registered on {new Date(student.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <form action="/api/approve-student" method="POST">
                            <input type="hidden" name="userId" value={student.id} />
                            <button
                              type="submit"
                              className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>Approve</span>
                            </button>
                          </form>
                          <form action="/api/reject-student" method="POST">
                            <input type="hidden" name="userId" value={student.id} />
                            <button
                              type="submit"
                              className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              <span>Reject</span>
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 