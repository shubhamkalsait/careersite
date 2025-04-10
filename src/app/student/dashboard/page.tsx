import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import SignOutButton from '@/components/SignOutButton'

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'student') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white" suppressHydrationWarning>
      <div className="py-10">
        <header className="border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                Student Dashboard
              </h1>
              <span className="text-sm text-gray-400">Welcome back!</span>
            </div>
            <SignOutButton />
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl rounded-lg p-6 border border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-xl font-bold">
                    {session.user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{session.user.name}</h2>
                    <p className="text-gray-400">{session.user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-medium mb-4 text-green-400">Your Profile</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Role</span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                          Student
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Email</span>
                        <span className="text-gray-300">{session.user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-medium mb-4 text-blue-400">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Search Jobs</span>
                      </button>
                      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>My Applications</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4 text-purple-400">Recent Job Listings</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <h4 className="font-medium text-lg">Software Engineer Intern</h4>
                      <p className="text-gray-400 text-sm">Tech Company Inc.</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Full-time</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Remote</span>
                      </div>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <h4 className="font-medium text-lg">Data Analyst</h4>
                      <p className="text-gray-400 text-sm">Data Solutions Ltd.</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Part-time</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Hybrid</span>
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