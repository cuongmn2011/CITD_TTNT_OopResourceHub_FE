import { NextResponse } from 'next/server'
import { API_ENDPOINT } from '@/config/api'

export async function GET(request, { params }) {
  try {
    const topicId = params.topicId
    
    const response = await fetch(`${API_ENDPOINT}/topics/${topicId}`, {
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
    console.error(`Error fetching topic ${params.topicId}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch topic details' },
      { status: 500 }
    )
  }
}
