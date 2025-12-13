'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import MainContent from '@/components/MainContent'
import SearchModal from '@/components/SearchModal'
import { useAppData } from '@/hooks/useAppData'
import { useSearch } from '@/hooks/useSearch'

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [selectedTopicTitle, setSelectedTopicTitle] = useState('Trí Tuệ Xém Nhân Tạo')
  
  const { categories, allTopics, sections, loading, error, loadSections } = useAppData()
  const { 
    isSearchOpen, 
    searchQuery, 
    searchResults, 
    selectedIndex,
    openSearch, 
    closeSearch, 
    setSearchQuery, 
    navigateResults,
    selectResult
  } = useSearch(categories, allTopics)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const selectTopic = async (topicId, topicTitle) => {
    setSelectedTopicId(topicId)
    setSelectedTopicTitle(topicTitle)
    await loadSections(topicId)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        openSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openSearch])

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
    <div className="flex h-screen bg-bg-color">
      <Sidebar
        categories={categories}
        allTopics={allTopics}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        onSelectTopic={selectTopic}
        selectedTopicId={selectedTopicId}
      />
      
      <MainContent
        topicTitle={selectedTopicTitle}
        sections={sections}
        selectedTopicId={selectedTopicId}
        onOpenSearch={openSearch}
      />

      <SearchModal
        isOpen={isSearchOpen}
        query={searchQuery}
        results={searchResults}
        selectedIndex={selectedIndex}
        onClose={closeSearch}
        onQueryChange={setSearchQuery}
        onNavigate={navigateResults}
        onSelect={selectResult}
        onSelectTopic={selectTopic}
      />
    </div>
  )
}