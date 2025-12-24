'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/services/apiService'

export function useAppData() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Load topics when category changes
  useEffect(() => {
    if (selectedCategory) {
      loadTopicsByCategory(selectedCategory.id)
    }
  }, [selectedCategory])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const categoriesData = await apiService.getCategories()
      setCategories(categoriesData)
      
      // Auto-select first category
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0])
      }
    } catch (err) {
      console.error('Error loading categories:', err)
      setError(`Không thể tải danh mục: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  const loadTopicsByCategory = async (categoryId) => {
    try {
      setTopicsLoading(true)
      const topicsData = await apiService.getTopicsByCategory(categoryId)
      setTopics(topicsData)
      
      // Auto-select first topic
      if (topicsData.length > 0) {
        loadTopicDetails(topicsData[0].id)
      } else {
        setSelectedTopic(null)
        setSections([])
      }
    } catch (err) {
      console.error('Error loading topics:', err)
      setTopics([])
    } finally {
      setTopicsLoading(false)
    }
  }

  const loadTopicDetails = async (topicId) => {
    try {
      // Load full topic with sections
      const topicData = await apiService.getTopic(topicId)
      setSelectedTopic(topicData)
      setSections(topicData.sections || [])
    } catch (err) {
      console.error('Error loading topic:', err)
      setSelectedTopic(null)
      setSections([])
    }
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setSelectedTopic(null)
    setSections([])
  }

  const handleTopicSelect = (topicId) => {
    loadTopicDetails(topicId)
  }

  return {
    categories,
    selectedCategory,
    handleCategorySelect,
    topics,
    selectedTopic,
    handleTopicSelect,
    sections,
    loading,
    topicsLoading,
    error
  }
}
