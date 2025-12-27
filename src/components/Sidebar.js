'use client'

import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGraduationCap, 
  faBars, 
  faBook,
  faFilter,
  faChevronDown,
  faChevronRight,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

export default function Sidebar({ 
  topics = [], // Giá trị mặc định an toàn
  allTopics = [],
  selectedTags = [],
  onTagsChange = () => {}, // Hàm giả để tránh lỗi nếu chưa truyền
  isCollapsed, 
  onToggle, 
  onSelectTopic, 
  selectedTopicId,
  loading
}) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)

  // Tính toán tags an toàn
  const uniqueTags = useMemo(() => {
    const tags = new Map()
    if (allTopics && Array.isArray(allTopics)) {
      allTopics.forEach(topic => {
        if (topic.tags && Array.isArray(topic.tags)) {
          topic.tags.forEach(tag => {
            if (tag && tag.id && !tags.has(tag.id)) {
              tags.set(tag.id, tag)
            }
          })
        }
      })
    }
    return Array.from(tags.values())
  }, [allTopics])

  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId))
    } else {
      onTagsChange([...selectedTags, tagId])
    }
  }

  // Kiểm tra an toàn cho danh sách hiển thị
  const safeTopics = Array.isArray(topics) ? topics : []

  return (
    <aside className={`
      bg-sidebar-bg bg-slate-900 text-white flex-shrink-0 transition-all duration-300 flex flex-col border-r border-gray-700 h-full
      ${isCollapsed ? 'w-16' : 'w-72'} 
    `}>
      {/* Header */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between h-[50px] flex-shrink-0">
        <h1 className={`font-bold text-base ${isCollapsed ? 'hidden' : 'block'}`}>
          <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-blue-400" />
          OOP Hub
        </h1>
        <button 
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FontAwesomeIcon icon={faBars} className="text-lg" />
        </button>
      </div>

      {/* Filter Section - Chỉ hiện khi mở rộng và có tags */}
      {!isCollapsed && uniqueTags.length > 0 && (
        <div className="border-b border-gray-700 flex-shrink-0">
          <button 
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="w-full px-4 py-2 flex items-center justify-between hover:bg-white/5 transition-colors text-xs uppercase font-semibold text-gray-400"
          >
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} />
              Lọc theo Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
            </span>
            <FontAwesomeIcon icon={isFilterExpanded ? faChevronDown : faChevronRight} />
          </button>
          
          {isFilterExpanded && (
            <div className="p-3 bg-gray-900/50 max-h-48 overflow-y-auto border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {uniqueTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`
                      px-2 py-1 rounded text-[10px] border transition-all
                      ${selectedTags.includes(tag.id)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400'
                      }
                    `}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                 <button 
                   onClick={() => onTagsChange([])}
                   className="mt-2 text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 w-full justify-center"
                 >
                   <FontAwesomeIcon icon={faTimes} /> Xóa bộ lọc
                 </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Topics List */}
      <nav className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {isCollapsed ? (
           <div className="flex flex-col items-center gap-4 mt-4">
             <FontAwesomeIcon icon={faBook} className="text-gray-400" />
           </div>
        ) : loading ? (
          <div className="text-center text-xs text-gray-400 py-4">
            <FontAwesomeIcon icon={faBook} className="animate-pulse mr-2" />
            Đang tải dữ liệu...
          </div>
        ) : safeTopics.length === 0 ? (
          <div className="text-center text-xs text-gray-400 py-8 px-4">
            <div className="mb-2 text-2xl">📭</div>
            Không tìm thấy chủ đề nào
          </div>
        ) : (
          <div className="space-y-0.5 pb-4">
            {safeTopics.filter(topic => topic && topic.id).map(topic => (
              <div
                key={topic.id}
                className={`
                  p-2.5 rounded-md cursor-pointer transition-all duration-200 group
                  ${selectedTopicId === topic.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'hover:bg-white/10 text-gray-300'
                  }
                `}
                onClick={() => onSelectTopic(topic.id, topic.title || 'Untitled')}
              >
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon 
                    icon={faBook} 
                    className={`mt-1 text-xs flex-shrink-0 ${selectedTopicId === topic.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium leading-tight mb-1 truncate">
                      {topic.title || 'Untitled'}
                    </div>
                    {/* Tags Preview */}
                    {topic.tags && topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 opacity-80">
                         {topic.tags.slice(0, 2).map(tag => (
                           <span key={tag.id} className="text-[10px] bg-black/20 px-1.5 rounded-sm">
                             #{tag.name}
                           </span>
                         ))}
                         {topic.tags.length > 2 && (
                           <span className="text-[10px] px-1">+{topic.tags.length - 2}</span>
                         )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-gray-700 text-[10px] text-gray-500 flex justify-between items-center bg-gray-900/50 flex-shrink-0">
          <span>{safeTopics.length} chủ đề</span>
          <span>v1.1</span>
        </div>
      )}
    </aside>
  )
}