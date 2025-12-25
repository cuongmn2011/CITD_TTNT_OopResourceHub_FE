'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faLightbulb,
  faFolder,
  faBook,
  faFileAlt,
  faSadTear,
  faSpinner,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

export default function SearchBar({
  query,
  results,
  selectedIndex,
  isSearching,
  onQueryChange,
  onNavigate,
  onSelect,
  onSelectTopic,
  onForceSearch,
  selectedCategory,
  onCategoryChange,
  categories
}) {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
    console.log('SearchBar updated:', { 
      query, 
      resultsCount: results?.length, 
      isOpen, 
      isSearching,
      results: results?.slice(0, 3) 
    })
  }, [query, results, isOpen, isSearching])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          setIsOpen(false)
          inputRef.current?.blur()
          break
        case 'ArrowDown':
          e.preventDefault()
          onNavigate(1)
          break
        case 'ArrowUp':
          e.preventDefault()
          onNavigate(-1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && results.length > 0) {
            handleResultSelect(results[selectedIndex])
          } else if (query.trim() && onForceSearch) {
            // Force search when pressing Enter with no selection
            onForceSearch()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, results, onNavigate])

  const handleResultSelect = async (result) => {
    onSelect(result)
    setIsOpen(false)
    inputRef.current?.blur()
    
    if (result.type === 'topic') {
      // Pass categoryId to onSelectTopic so it can switch category if needed
      onSelectTopic(result.id, result.title, result.categoryId)
    } else if (result.type === 'category') {
      // For categories, just close the search - user can click category tab
      setIsOpen(false)
    } else if (result.type === 'section') {
      // For sections, get the topic's categoryId from results
      const parentTopic = results.find(r => r.type === 'topic' && r.id === result.topicId)
      const categoryId = parentTopic?.categoryId || null
      onSelectTopic(result.topicId, result.topicTitle, categoryId)
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'category': return faFolder
      case 'topic': return faBook
      case 'section': return faFileAlt
      default: return faBook
    }
  }

  const highlightMatch = (text, query) => {
    if (!query || !text) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 font-bold">$1</mark>')
  }

  const handleClearSearch = () => {
    onQueryChange('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="relative flex-1 max-w-xl">
      {/* Search Input */}
      <div className="relative">
        <FontAwesomeIcon 
          icon={faSearch} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Tìm kiếm topics, categories, sections... (Ctrl+K)"
          className="w-full pl-12 pr-12 py-2.5 bg-gray-100 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white 
                     transition-all"
        />
        {query && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                       hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl 
                     border border-gray-200 max-h-[500px] overflow-y-auto z-50"
        >
          {!query ? (
            <div className="p-8 text-center text-gray-500">
              <FontAwesomeIcon icon={faLightbulb} className="text-2xl text-yellow-500 mb-3" />
              <p className="mb-3">Nhập để tìm kiếm</p>
              <div className="flex justify-center gap-2 flex-wrap text-xs">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  Ví dụ: "OOP"
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  Fuzzy search
                </span>
              </div>
            </div>
          ) : isSearching ? (
            <div className="p-8 text-center text-gray-500">
              <FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-600 mb-3 animate-spin" />
              <p>Đang tìm kiếm...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FontAwesomeIcon icon={faSadTear} className="text-3xl text-blue-600 mb-3" />
              <h3 className="font-semibold mb-1">Không tìm thấy kết quả</h3>
              <p className="text-sm">Thử từ khóa khác</p>
            </div>
          ) : (
            <div className="p-2">
              {['topics', 'categories', 'sections'].map(type => {
                const typeResults = results.filter(r => 
                  (type === 'topics' && r.type === 'topic') ||
                  (type === 'categories' && r.type === 'category') ||
                  (type === 'sections' && r.type === 'section')
                )
                
                if (typeResults.length === 0) return null

                return (
                  <div key={type} className="mb-2">
                    <div className="text-xs font-bold uppercase text-gray-500 px-3 py-1">
                      {type === 'topics' ? `Topics (${typeResults.length})` :
                       type === 'categories' ? `Categories (${typeResults.length})` :
                       `Sections (${typeResults.length})`}
                    </div>
                    
                    {typeResults.map((result) => {
                      const globalIndex = results.indexOf(result)
                      return (
                        <div
                          key={`${result.type}-${result.id}`}
                          className={`
                            flex items-center p-2.5 mx-1 rounded-lg cursor-pointer transition-colors
                            ${selectedIndex === globalIndex 
                              ? 'bg-blue-600 text-white' 
                              : 'hover:bg-gray-100'}
                          `}
                          onClick={() => handleResultSelect(result)}
                        >
                          <FontAwesomeIcon 
                            icon={getIcon(result.type)} 
                            className={`mr-3 text-sm ${
                              selectedIndex === globalIndex ? 'text-white' : 'text-blue-600'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div 
                              className="font-medium text-sm"
                              dangerouslySetInnerHTML={{ 
                                __html: highlightMatch(result.title, query) 
                              }}
                            />
                            {result.meta && (
                              <div className={`text-xs ${
                                selectedIndex === globalIndex ? 'text-white/80' : 'text-gray-500'
                              }`}>
                                {result.meta}
                              </div>
                            )}
                            {/* Tags for topics */}
                            {result.type === 'topic' && result.data?.tags && result.data.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.data.tags.slice(0, 3).map(tag => (
                                  <span 
                                    key={tag.id}
                                    className={`inline-block px-2 py-0.5 text-[10px] rounded-full ${
                                      selectedIndex === globalIndex 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                                    }`}
                                  >
                                    #{tag.slug}
                                  </span>
                                ))}
                                {result.data.tags.length > 3 && (
                                  <span className={`text-[10px] ${
                                    selectedIndex === globalIndex ? 'text-white/60' : 'text-gray-400'
                                  }`}>
                                    +{result.data.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
