'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import SignOutButton from '@/components/SignOutButton'

interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  createdAt: string
}

export default function StudentDashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchJobs()
    }
  }, [status])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (!response.ok) throw new Error('Failed to fetch jobs')
      const data = await response.json()
      setJobs(data)
    } catch (err) {
      setError('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session?.user || session.user.role !== 'student') {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Back to Dashboard
            </button>
            <SignOutButton />
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No jobs available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors"
              >
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <p className="text-gray-400 mb-4">{job.company}</p>
                <p className="text-gray-300 mb-4">{job.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{job.location}</span>
                  <button
                    onClick={() => router.push(`/student/jobs/${job.id}`)}
                    className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 