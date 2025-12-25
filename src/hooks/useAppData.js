'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/services/apiService'

export function useAppData() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [topics, setTopics] = useState([])
  const [filteredTopics, setFilteredTopics] = useState([]) // Filtered topics based on selected tags
  const [selectedTags, setSelectedTags] = useState([]) // Array of selected tag IDs
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loadingCategoryId, setLoadingCategoryId] = useState(null) // Track which category is loading
  const [skipAutoLoad, setSkipAutoLoad] = useState(false) // Flag to skip useEffect auto-load when manually loading

  // Filter topics when tags selection changes
  useEffect(() => {
    if (selectedTags.length === 0) {
      // No tags selected, show all topics
      setFilteredTopics(topics)
    } else {
      // Filter topics that have ALL selected tags (AND logic)
      const filtered = topics.filter(topic => {
        if (!topic.tags || topic.tags.length === 0) return false
        const topicTagIds = topic.tags.map(tag => tag.id)
        return selectedTags.every(selectedTagId => topicTagIds.includes(selectedTagId))
      })
      setFilteredTopics(filtered)
    }
  }, [topics, selectedTags])

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Load topics when category changes
  useEffect(() => {
    if (skipAutoLoad) {
      console.log(`⏭️  [useEffect] SKIP - skipAutoLoad flag is set`)
      setSkipAutoLoad(false) // Reset flag
      return
    }
    
    if (selectedCategory && selectedCategory.id !== loadingCategoryId) {
      console.log(`🔔 [useEffect] Category changed to ${selectedCategory.id}, current loadingCategoryId: ${loadingCategoryId}`)
      loadTopicsByCategory(selectedCategory.id)
    } else if (selectedCategory && selectedCategory.id === loadingCategoryId) {
      console.log(`⏭️  [useEffect] SKIP - Already loading category ${selectedCategory.id}`)
    }
  }, [selectedCategory])

  const loadCategories = async () => {
    try {
      setLoading(true)
      
      // Check SessionStorage first for categories
      const cacheKey = 'categories_all'
      const cachedData = sessionStorage.getItem(cacheKey)
      
      let categoriesData = null
      
      if (cachedData) {
        console.log('📦 Loading categories from cache')
        categoriesData = JSON.parse(cachedData)
      } else {
        // Fetch from API if not cached
        console.log('🌐 Fetching categories from API')
        categoriesData = await apiService.getCategories()
        
        // Save to SessionStorage BEFORE any state updates
        sessionStorage.setItem(cacheKey, JSON.stringify(categoriesData))
      }
      
      // Update state after data is ready
      setCategories(categoriesData)
      
      // Auto-select first category after categories state is set
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

  const loadTopicsByCategory = async (categoryId, autoSelectFirst = true) => {
    console.log(`🔄 [loadTopicsByCategory] START for category ${categoryId}, autoSelectFirst: ${autoSelectFirst}`)
    
    // Prevent duplicate calls
    if (loadingCategoryId === categoryId) {
      console.log(`⏭️  [loadTopicsByCategory] SKIP - Already loading category ${categoryId}`)
      return
    }
    
    try {
      setLoadingCategoryId(categoryId) // Mark as loading
      setTopicsLoading(true)
      console.log(`⏳ [loadTopicsByCategory] Set topicsLoading = true, loadingCategoryId = ${categoryId}`)
      
      // Check SessionStorage first
      const cacheKey = `topics_category_${categoryId}`
      const cachedData = sessionStorage.getItem(cacheKey)
      
      let topicsData = null
      
      if (cachedData) {
        // Load from cache
        console.log(`📦 [loadTopicsByCategory] Found cache for category ${categoryId}`)
        topicsData = JSON.parse(cachedData)
        console.log(`📦 [loadTopicsByCategory] Parsed ${topicsData.length} topics from cache`)
      } else {
        // Fetch from API if not cached
        console.log(`🌐 [loadTopicsByCategory] No cache, fetching from API for category ${categoryId}`)
        topicsData = await apiService.getTopicsByCategory(categoryId)
        console.log(`🌐 [loadTopicsByCategory] API returned ${topicsData.length} topics`)
        
        // Save to SessionStorage BEFORE any state updates
        sessionStorage.setItem(cacheKey, JSON.stringify(topicsData))
        console.log(`💾 [loadTopicsByCategory] Saved to sessionStorage: ${cacheKey}`)
      }
      
      // Update state after data is ready
      console.log(`📝 [loadTopicsByCategory] Setting topics state with ${topicsData.length} items`)
      setTopics(topicsData)
      console.log(`✅ [loadTopicsByCategory] Topics state updated`)
      
      // Auto-select first topic after topics state is set (only if autoSelectFirst is true)
      if (autoSelectFirst && topicsData.length > 0) {
        console.log(`🎯 [loadTopicsByCategory] Auto-selecting first topic: ${topicsData[0].id} - ${topicsData[0].title}`)
        await loadTopicDetails(topicsData[0].id)
        console.log(`✅ [loadTopicsByCategory] First topic loaded`)
      } else if (!autoSelectFirst) {
        console.log(`⏭️  [loadTopicsByCategory] Skipping auto-select (autoSelectFirst = false)`)
      } else {
        console.log(`⚠️  [loadTopicsByCategory] No topics found, clearing selection`)
        setSelectedTopic(null)
        setSections([])
      }
    } catch (err) {
      console.error(`❌ [loadTopicsByCategory] ERROR:`, err)
      setTopics([])
      setSelectedTopic(null)
      setSections([])
    } finally {
      setLoadingCategoryId(null) // Clear loading marker
      setTopicsLoading(false)
      console.log(`✅ [loadTopicsByCategory] COMPLETE - Set topicsLoading = false, cleared loadingCategoryId`)
    }
  }

  const loadTopicDetails = async (topicId) => {
    console.log(`🔄 [loadTopicDetails] START for topic ${topicId}`)
    try {
      // Check SessionStorage first
      const cacheKey = `topic_detail_${topicId}`
      const cachedData = sessionStorage.getItem(cacheKey)
      
      let topicData = null
      
      if (cachedData) {
        // Load from cache
        console.log(`📦 [loadTopicDetails] Found cache for topic ${topicId}`)
        topicData = JSON.parse(cachedData)
        console.log(`📦 [loadTopicDetails] Parsed topic: ${topicData.title}, sections: ${topicData.sections?.length || 0}`)
      } else {
        // Fetch from API if not cached
        console.log(`🌐 [loadTopicDetails] No cache, fetching from API for topic ${topicId}`)
        topicData = await apiService.getTopic(topicId)
        console.log(`🌐 [loadTopicDetails] API returned topic: ${topicData.title}, sections: ${topicData.sections?.length || 0}`)
        
        // Save to SessionStorage
        sessionStorage.setItem(cacheKey, JSON.stringify(topicData))
        console.log(`💾 [loadTopicDetails] Saved to sessionStorage: ${cacheKey}`)
      }
      
      console.log(`📝 [loadTopicDetails] Setting selectedTopic and sections`)
      setSelectedTopic(topicData)
      setSections(topicData.sections || [])
      console.log(`✅ [loadTopicDetails] State updated - sections count: ${topicData.sections?.length || 0}`)
    } catch (err) {
      console.error(`❌ [loadTopicDetails] ERROR:`, err)
      setSelectedTopic(null)
      setSections([])
    }
    console.log(`✅ [loadTopicDetails] COMPLETE`)
  }

  const handleCategorySelect = (category) => {
    console.log(`🎯 [handleCategorySelect] User clicked category: ${category.id} - ${category.name}`)
    console.log(`📝 [handleCategorySelect] Previous category: ${selectedCategory?.id || 'none'}`)
    
    // Clear tag filters when switching category
    if (selectedTags.length > 0) {
      console.log(`🏷️  [handleCategorySelect] Clearing ${selectedTags.length} selected tags`)
      setSelectedTags([])
    }
    
    setSelectedCategory(category)
    setSelectedTopic(null)
    setSections([])
    console.log(`✅ [handleCategorySelect] State cleared, will trigger loadTopicsByCategory via useEffect`)
  }

  const handleTopicSelect = (topicId) => {
    console.log(`🎯 [handleTopicSelect] User clicked topic: ${topicId}`)
    loadTopicDetails(topicId)
  }

  const selectTopicFromSearch = async (topicId, categoryId) => {
    console.log(`🔍 [selectTopicFromSearch] Search selected topic ${topicId} in category ${categoryId}`)
    
    // Clear any tag filters that might hide the topic
    if (selectedTags.length > 0) {
      console.log(`🏷️  [selectTopicFromSearch] Clearing tag filters`)
      setSelectedTags([])
    }
    
    // Check if need to switch category
    if (categoryId && selectedCategory?.id !== categoryId) {
      console.log(`📂 [selectTopicFromSearch] Switching category from ${selectedCategory?.id} to ${categoryId}`)
      const targetCategory = categories.find(cat => cat.id === categoryId)
      if (targetCategory) {
        // Set flag to prevent useEffect from loading again
        setSkipAutoLoad(true)
        
        // Update category state first
        setSelectedCategory(targetCategory)
        
        // Directly call loadTopicsByCategory and wait for it to complete
        // Pass autoSelectFirst=false to skip auto-selecting first topic
        console.log(`⏳ [selectTopicFromSearch] Waiting for topics to load...`)
        await loadTopicsByCategory(categoryId, false)
        console.log(`✅ [selectTopicFromSearch] Topics loaded, now loading specific topic ${topicId}`)
        
        // Now load the specific topic details
        await loadTopicDetails(topicId)
      } else {
        // Category not found, just load topic details
        console.log(`⚠️  [selectTopicFromSearch] Category ${categoryId} not found, loading topic directly`)
        await loadTopicDetails(topicId)
      }
    } else {
      // Same category, just load topic details
      console.log(`📄 [selectTopicFromSearch] Same category, loading topic details`)
      await loadTopicDetails(topicId)
    }
  }

  const handleTagsChange = (newSelectedTags) => {
    console.log(`🏷️  [handleTagsChange] Tags changed:`, newSelectedTags)
    setSelectedTags(newSelectedTags)
    // Clear selected topic when filtering changes
    setSelectedTopic(null)
    setSections([])
  }

  return {
    categories,
    selectedCategory,
    handleCategorySelect,
    topics: filteredTopics, // Return filtered topics instead of all topics
    allTopics: topics, // Expose all topics for TagFilterPanel
    selectedTags,
    handleTagsChange,
    selectedTopic,
    handleTopicSelect,
    selectTopicFromSearch, // New function for search-triggered topic selection
    sections,
    loading,
    topicsLoading,
    error
  }
}