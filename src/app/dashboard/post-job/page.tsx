'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function PostJobPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
            <p className="text-gray-400">Please wait while we verify your session.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== 'admin') {
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const jobData = {
      title: formData.get('title'),
      company: formData.get('company'),
      location: formData.get('location'),
      description: formData.get('description'),
      type: formData.get('type'),
      requirements: formData.get('requirements'),
      salary: formData.get('salary'),
    }

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to post job')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error posting job:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Post a New Job</h1>
          <p className="text-gray-300">Fill in the details below to create a new job posting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 text-red-300 p-4 rounded-lg border border-red-500/30">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-200">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 hover:border-gray-500 transition-colors"
                placeholder="e.g. Software Engineer"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2 text-gray-200">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 hover:border-gray-500 transition-colors"
                placeholder="e.g. Tech Corp"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2 text-gray-200">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 hover:border-gray-500 transition-colors"
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-2 text-gray-200">
                Job Type
              </label>
              <select
                id="type"
                name="type"
                required
                className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-500 transition-colors"
              >
                <option value="" className="text-gray-500">Select job type</option>
                <option value="full-time" className="text-gray-100">Full Time</option>
                <option value="part-time" className="text-gray-100">Part Time</option>
                <option value="contract" className="text-gray-100">Contract</option>
                <option value="internship" className="text-gray-100">Internship</option>
              </select>
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium mb-2 text-gray-200">
                Salary (Optional)
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 hover:border-gray-500 transition-colors"
                placeholder="e.g. $50,000 - $70,000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-200">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 hover:border-gray-500 transition-colors"
              placeholder="Describe the job responsibilities and requirements..."
            />
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-medium mb-2 text-gray-200">
              Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              required
              rows={4}
              className="w-full bg-gray-900/80 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 hover:border-gray-500 transition-colors"
              placeholder="List the required skills and qualifications..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-200 hover:bg-gray-700/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 