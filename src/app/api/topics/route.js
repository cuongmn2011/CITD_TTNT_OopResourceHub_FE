import { NextResponse } from 'next/server'
import { API_ENDPOINT } from '@/config/api'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')
    
    let url = `${API_ENDPOINT}/topics/`
    if (categoryId) {
      url += `?category_id=${categoryId}`
    }

    const response = await fetch(url, {
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
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}