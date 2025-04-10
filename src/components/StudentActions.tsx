'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface StudentActionsProps {
  userId: string
  status: string
}

export default function StudentActions({ userId, status }: StudentActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAction = async (action: 'approve' | 'delete') => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/${action}-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to process action')
      }

      // Refresh the page to show updated list
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to process action. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex space-x-3">
      {status === 'pending' && (
        <button
          onClick={() => handleAction('approve')}
          disabled={isLoading}
          className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Approve</span>
        </button>
      )}
      <button
        onClick={() => {
          if (confirm('Are you sure you want to delete this student registration? They can re-register if needed.')) {
            handleAction('delete')
          }
        }}
        disabled={isLoading}
        className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>Delete</span>
      </button>
    </div>
  )
} 