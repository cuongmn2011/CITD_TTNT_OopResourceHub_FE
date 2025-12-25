'use client'

import { useState, useCallback, useEffect } from 'react'
import { apiService } from '@/services/apiService'

export function useSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchTrigger, setSearchTrigger] = useState(0)

  const openSearch = useCallback(() => {
    setIsOpen(true)
    setQuery('')
    setSelectedIndex(-1)
    setSearchResults([])
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(-1)
    setSearchResults([])
  }, [])

  // Debounced search - gọi API sau khi người dùng ngừng gõ 600ms
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const abortController = new AbortController()
    
    const timeoutId = setTimeout(async () => {
      try {
        const response = await apiService.search(query, 20, abortController.signal)
        console.log('Search API response:', response)
        
        // Transform API response to match frontend format
        const results = []

        // Add topics (with tags if available)
        if (response.topics && Array.isArray(response.topics)) {
          response.topics.forEach(topic => {
            results.push({
              type: 'topic',
              id: topic.id,
              title: topic.title,
              meta: topic.category_name,
              categoryId: topic.category_id,
              data: {
                ...topic,
                tags: topic.tags || []  // Ensure tags array exists
              },
              score: topic.score
            })
          })
        }

        // Add sections
        if (response.sections && Array.isArray(response.sections)) {
          response.sections.forEach(section => {
            results.push({
              type: 'section',
              id: section.id,
              title: section.heading,
              meta: `Trong topic: ${section.topic_title}`,
              topicId: section.topic_id,
              topicTitle: section.topic_title,
              sectionId: section.id,
              score: section.score
            })
          })
        }

        // Add categories
        if (response.categories && Array.isArray(response.categories)) {
          response.categories.forEach(cat => {
            results.push({
              type: 'category',
              id: cat.id,
              title: cat.title,
              meta: cat.description || `${cat.topic_count} topics`,
              score: cat.score
            })
          })
        }

        // Sort by score
        results.sort((a, b) => (b.score || 0) - (a.score || 0))
        
        console.log('Transformed results:', results.length, results.slice(0, 5))
        setSearchResults(results)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error)
          setSearchResults([])
        }
      } finally {
        setIsSearching(false)
      }
    }, 600)

    return () => {
      clearTimeout(timeoutId)
      abortController.abort()
    }
  }, [query, searchTrigger])

  const navigateResults = useCallback((direction) => {
    if (searchResults.length === 0) return
    
    setSelectedIndex(prev => {
      let newIndex = prev + direction
      if (newIndex < 0) newIndex = searchResults.length - 1
      if (newIndex >= searchResults.length) newIndex = 0
      return newIndex
    })
  }, [searchResults.length])

  const selectResult = useCallback((result) => {
    closeSearch()
    // Additional logic can be added here for specific result handling
  }, [closeSearch])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [searchResults])

  const forceSearch = useCallback(() => {
    setSearchTrigger(prev => prev + 1)
  }, [])

  return {
    isSearchOpen: isOpen,
    searchQuery: query,
    searchResults,
    selectedIndex,
    isSearching,
    openSearch,
    closeSearch,
    setSearchQuery: setQuery,
    navigateResults,
    selectResult,
    forceSearch
  }
}