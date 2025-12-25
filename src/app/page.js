'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import MainContent from '@/components/MainContent'
import SearchBar from '@/components/SearchBar'
import TagFilterPanel from '@/components/TagFilterPanel'
import { useAppData } from '@/hooks/useAppData'
import { useSearch } from '@/hooks/useSearch'
import { apiService } from '@/services/apiService'

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [relatedTopics, setRelatedTopics] = useState([])
  const [loadingRelated, setLoadingRelated] = useState(false)
  
  const {
    categories,
    selectedCategory,
    handleCategorySelect,
    topics,
    allTopics,
    selectedTags,
    handleTagsChange,
    selectedTopic,
    handleTopicSelect,
    selectTopicFromSearch,
    sections,
    loading,
    topicsLoading,
    error
  } = useAppData()
  
  const { 
    searchQuery, 
    searchResults, 
    selectedIndex,
    isSearching,
    setSearchQuery, 
    navigateResults,
    selectResult,
    forceSearch
  } = useSearch()

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const selectTopic = async (topicId, topicTitle, categoryId = null) => {
    // If categoryId provided (from search), use selectTopicFromSearch
    if (categoryId) {
      await selectTopicFromSearch(topicId, categoryId)
    } else {
      // Normal topic selection from sidebar
      handleTopicSelect(topicId)
    }
    
    // Load related topics
    setLoadingRelated(true)
    try {
      const related = await apiService.getRelatedTopics(topicId)
      // Backend returns List[TopicResponse] directly, not wrapped in {topic: ...}
      setRelatedTopics(Array.isArray(related) ? related : [])
    } catch (err) {
      console.error('Error loading related topics:', err)
      setRelatedTopics([])
    } finally {
      setLoadingRelated(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.querySelector('input[placeholder*="Tìm kiếm"]')?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-text-secondary">Đang tải...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">❌ {error}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-bg-color">
      {/* Header with Category Tabs and Search */}
      <div className="bg-white border-b border-border-color shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search Bar Row */}
          <div className="flex items-center gap-4 py-3 border-b border-gray-200">
            <h1 className="font-bold text-xl text-blue-600 whitespace-nowrap">
              OOP Hub
            </h1>
            <SearchBar
              query={searchQuery}
              results={searchResults}
              selectedIndex={selectedIndex}
              isSearching={isSearching}
              onQueryChange={setSearchQuery}
              onNavigate={navigateResults}
              onSelect={selectResult}
              onSelectTopic={selectTopic}
              onForceSearch={forceSearch}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategorySelect}
              categories={categories}
            />
          </div>
          
          {/* Category Tabs Row */}
          <div className="flex space-x-1 overflow-x-auto py-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className={`
                  px-6 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap
                  ${selectedCategory?.id === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tag Filter Panel */}
      <TagFilterPanel
        topics={allTopics}
        selectedTags={selectedTags}
        onTagsChange={handleTagsChange}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          topics={topics}
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
          onSelectTopic={selectTopic}
          selectedTopicId={selectedTopic?.id}
          loading={topicsLoading}
        />
        
        <MainContent
          topicTitle={selectedTopic?.title || 'Chọn một chủ đề'}
          sections={sections}
          selectedTopicId={selectedTopic?.id}
          selectedTopic={selectedTopic}
          relatedTopics={relatedTopics}
          loadingRelated={loadingRelated}
          onTopicClick={selectTopic}
        />
      </div>
    </div>
  )
}