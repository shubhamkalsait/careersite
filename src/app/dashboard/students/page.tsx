'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import SignOutButton from '@/components/SignOutButton'

interface Student {
  id: string
  name: string
  email: string
  status: string
  createdAt: string
}

export default function StudentsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStudents()
    }
  }, [status])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (!response.ok) throw new Error('Failed to fetch students')
      const data = await response.json()
      setStudents(data)
    } catch (err) {
      setError('Failed to load students')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return

    setDeleteLoading(studentId)
    try {
      const response = await fetch(`/api/delete-student?id=${studentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete student')
      }

      // Remove the deleted student from the list
      setStudents(students.filter(student => student.id !== studentId))
    } catch (err) {
      setError('Failed to delete student')
    } finally {
      setDeleteLoading(null)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session?.user || session.user.role !== 'admin') {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            All Students
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
          <div className="text-center py-8">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No students found</div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Joined</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.status === 'approved' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(student.id)}
                        disabled={deleteLoading === student.id}
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      >
                        {deleteLoading === student.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 