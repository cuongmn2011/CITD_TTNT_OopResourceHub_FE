'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/services/apiService'

export function useAppData() {
  const [categories, setCategories] = useState([])
  const [allTopics, setAllTopics] = useState({})
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load categories
      const categoriesData = await apiService.getCategories()
      setCategories(categoriesData)
      
      // Load all topics
      const topicsData = await apiService.getAllTopics()
      
      // Group topics by category
      const groupedTopics = {}
      categoriesData.forEach(cat => {
        groupedTopics[cat.id] = topicsData.filter(t => t.category_id === cat.id)
      })
      setAllTopics(groupedTopics)
      
    } catch (err) {
      console.error('Error loading data:', err)
      setError(`Không thể tải dữ liệu: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  const loadSections = async (topicId) => {
    try {
      const sectionsData = await apiService.getSections(topicId)
      setSections(sectionsData)
    } catch (err) {
      console.error('Error loading sections:', err)
      setSections([])
    }
  }

  return {
    categories,
    allTopics,
    sections,
    loading,
    error,
    loadSections
  }
}