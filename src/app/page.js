'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import MainContent from '@/components/MainContent'
import SearchBar from '@/components/SearchBar'
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

  // Hàm này chỉ còn nhiệm vụ điều hướng/chọn topic, không gọi API related nữa
  const selectTopic = async (topicId, topicTitle, categoryId = null) => {
    if (categoryId) {
      await selectTopicFromSearch(topicId, categoryId)
    } else {
      await handleTopicSelect(topicId)
    }
  }

  // Effect mới: Tự động gọi API Related Topics mỗi khi selectedTopic thay đổi
  // Xử lý được cả trường hợp click thủ công và auto-select khi đổi category
  useEffect(() => {
    const fetchRelatedTopics = async () => {
      if (!selectedTopic?.id) {
        setRelatedTopics([])
        return
      }

      setLoadingRelated(true)
      try {
        const related = await apiService.getRelatedTopics(selectedTopic.id)
        setRelatedTopics(Array.isArray(related) ? related : [])
      } catch (err) {
        console.error('Error loading related topics:', err)
        setRelatedTopics([])
      } finally {
        setLoadingRelated(false)
      }
    }

    fetchRelatedTopics()
  }, [selectedTopic?.id]) // Chạy lại khi ID topic thay đổi

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

  // Clear related topics khi đổi category (để tránh hiển thị dữ liệu cũ trong lúc chờ load mới)
  useEffect(() => {
    setRelatedTopics([])
    setLoadingRelated(false)
  }, [selectedCategory?.id])

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
      {/* Header Siêu Compact */}
      <div className="bg-white border-b border-border-color shadow-sm flex-shrink-0 z-20">
        <div className="max-w-7xl mx-auto px-2">
          
          {/* Hàng 1: Logo & Search - Cực gọn */}
          <div className="flex items-center gap-3 py-1 border-b border-gray-100 h-10">
            <h1 className="font-bold text-base text-blue-600 whitespace-nowrap">
              Dev Hub
            </h1>
            <div className="flex-1">
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
          </div>
          
          {/* Hàng 2: Category Tabs - Slim */}
          <div className="flex space-x-1 overflow-x-auto py-0.5 min-h-[28px]">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className={`
                  px-3 py-0.5 rounded text-[11px] font-medium transition-all whitespace-nowrap border
                  ${selectedCategory?.id === category.id
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          topics={topics}
          allTopics={allTopics}
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
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