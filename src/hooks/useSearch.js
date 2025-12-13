'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'

export function useSearch(categories, allTopics) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const openSearch = useCallback(() => {
    setIsOpen(true)
    setQuery('')
    setSelectedIndex(-1)
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(-1)
  }, [])

  const removeVietnameseTones = (str) => {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
  }

  const fuzzyMatch = (text, searchQuery) => {
    if (!text || !searchQuery) return false
    
    const textLower = removeVietnameseTones(text.toLowerCase())
    const queryLower = removeVietnameseTones(searchQuery.toLowerCase())
    
    // Exact match
    if (textLower.includes(queryLower)) return true
    
    // Fuzzy match - sequential character matching
    let queryIndex = 0
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++
      }
    }
    
    return queryIndex === queryLower.length
  }

  const searchResults = useMemo(() => {
    if (!query.trim()) return []

    const results = []
    const lowerQuery = query.toLowerCase()

    // Search categories
    categories.forEach(cat => {
      if (fuzzyMatch(cat.name, lowerQuery)) {
        results.push({
          type: 'category',
          id: cat.id,
          title: cat.name,
          meta: '',
          topics: allTopics[cat.id] || []
        })
      }
    })

    // Search topics
    for (const catId in allTopics) {
      const categoryName = categories.find(c => c.id == catId)?.name || ''
      
      allTopics[catId].forEach(topic => {
        if (fuzzyMatch(topic.title, lowerQuery) || 
            (topic.short_definition && fuzzyMatch(topic.short_definition, lowerQuery))) {
          results.push({
            type: 'topic',
            id: topic.id,
            title: topic.title,
            meta: categoryName,
            data: topic
          })
        }
      })
    }

    // Search sections
    for (const catId in allTopics) {
      allTopics[catId].forEach(topic => {
        if (topic.sections) {
          topic.sections.forEach(section => {
            if (section.heading && fuzzyMatch(section.heading, lowerQuery)) {
              results.push({
                type: 'section',
                id: section.id,
                title: section.heading,
                meta: `Trong topic: ${topic.title}`,
                topicId: topic.id,
                topicTitle: topic.title,
                sectionId: section.id
              })
            }
          })
        }
      })
    }

    return results
  }, [query, categories, allTopics])

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

  return {
    isSearchOpen: isOpen,
    searchQuery: query,
    searchResults,
    selectedIndex,
    openSearch,
    closeSearch,
    setSearchQuery: setQuery,
    navigateResults,
    selectResult
  }
}