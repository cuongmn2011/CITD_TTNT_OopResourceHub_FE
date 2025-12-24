import { NextResponse } from 'next/server'
import { API_ENDPOINT } from '@/config/api'

export async function GET(request, { params }) {
  try {
    const topicId = params.topicId

    const response = await fetch(`${API_ENDPOINT}/topics/${topicId}/related`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching related topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch related topics' },
      { status: 500 }
    )
  }
}
