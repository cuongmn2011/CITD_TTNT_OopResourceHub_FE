'use client'

import { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faTimes, 
  faLightbulb,
  faFolder,
  faBook,
  faFileAlt,
  faSadTear,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'

export default function SearchModal({
  isOpen,
  query,
  results,
  selectedIndex,
  isSearching,
  onClose,
  onQueryChange,
  onNavigate,
  onSelect,
  onSelectTopic
}) {
  const inputRef = useRef(null)
  const resultsRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
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
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, results, onClose, onNavigate])

  const handleResultSelect = (result) => {
    onSelect(result)
    
    if (result.type === 'topic') {
      onSelectTopic(result.id, result.title)
    } else if (result.type === 'category') {
      // Could expand category and select first topic
      const firstTopic = result.topics?.[0]
      if (firstTopic) {
        onSelectTopic(firstTopic.id, firstTopic.title)
      }
    } else if (result.type === 'section') {
      onSelectTopic(result.topicId, result.topicTitle)
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-[slideDown_0.3s_ease]">
        {/* Header */}
        <div className="flex items-center p-6 border-b border-border-color">
          <div className="flex items-center flex-1 gap-3">
            <FontAwesomeIcon icon={faSearch} className="text-primary text-lg" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Tìm kiếm topics, categories, sections..."
              className="flex-1 text-lg outline-none"
            />
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
          </button>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto">
          {!query ? (
            <div className="p-16 text-center text-gray-500">
              <FontAwesomeIcon icon={faLightbulb} className="text-3xl text-yellow-500 mb-4" />
              <p className="text-lg mb-4">Nhập để tìm kiếm topics, categories, hoặc sections</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                  Ví dụ: "Làm sao để hiểu OOP"
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                  Fuzzy search enabled
                </span>
              </div>
            </div>
          ) : isSearching ? (
            <div className="p-16 text-center text-gray-500">
              <FontAwesomeIcon icon={faSpinner} className="text-3xl text-primary mb-4 animate-spin" />
              <p className="text-lg">Đang tìm kiếm...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <FontAwesomeIcon icon={faSadTear} className="text-4xl text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h3>
              <p>Thử từ khóa khác hoặc kiểm tra chính tả</p>
            </div>
          ) : (
            <div className="p-4">
              {/* Group results by type */}
              {['topics', 'categories', 'sections'].map(type => {
                const typeResults = results.filter(r => 
                  (type === 'topics' && r.type === 'topic') ||
                  (type === 'categories' && r.type === 'category') ||
                  (type === 'sections' && r.type === 'section')
                )
                
                if (typeResults.length === 0) return null

                return (
                  <div key={type} className="mb-6">
                    <div className="text-xs font-bold uppercase text-gray-500 mb-2 px-4">
                      {type === 'topics' ? `Topics (${typeResults.length})` :
                       type === 'categories' ? `Categories (${typeResults.length})` :
                       `Sections (${typeResults.length})`}
                    </div>
                    
                    {typeResults.map((result, index) => {
                      const globalIndex = results.indexOf(result)
                      return (
                        <div
                          key={`${result.type}-${result.id}`}
                          className={`
                            flex items-center p-3 mx-2 rounded-lg cursor-pointer transition-colors
                            ${selectedIndex === globalIndex ? 'bg-primary text-white' : 'hover:bg-gray-100'}
                          `}
                          onClick={() => handleResultSelect(result)}
                        >
                          <FontAwesomeIcon 
                            icon={getIcon(result.type)} 
                            className={`mr-3 ${selectedIndex === globalIndex ? 'text-white' : 'text-primary'}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div 
                              className="font-semibold"
                              dangerouslySetInnerHTML={{ 
                                __html: highlightMatch(result.title, query) 
                              }}
                            />
                            {result.meta && (
                              <div className={`text-sm ${selectedIndex === globalIndex ? 'text-white/80' : 'text-gray-500'}`}>
                                {result.meta}
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
      </div>
    </div>
  )
}