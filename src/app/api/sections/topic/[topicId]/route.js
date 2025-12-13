import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const topicId = params.topicId

    const response = await fetch(`https://citd-ttnt-oop-resource-hub-be.vercel.app/api/v1/sections/topic/${topicId}`, {
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
    console.error('Error fetching sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    )
  }
}