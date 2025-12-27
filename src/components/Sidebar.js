'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGraduationCap, 
  faBars, 
  faBook,
  faFilter,
  faChevronDown,
  faChevronRight,
  faTimes,
  faUsers,
  faIdCard
} from '@fortawesome/free-solid-svg-icons'

export default function Sidebar({ 
  topics = [], 
  allTopics = [],
  selectedTags = [],
  onTagsChange = () => {}, 
  isCollapsed, 
  onToggle, 
  onSelectTopic, 
  selectedTopicId,
  loading
}) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const memberRef = useRef(null)

  const members = [
    { id: '25410026', name: 'Nguyễn Mạnh Cường' },
    { id: '25410027', name: 'Phạm Văn Cường' },
    { id: '25410076', name: 'Nguyễn Thanh Kỳ' },
    { id: '25410111', name: 'Đặng Thiên Phước' },
    { id: '25410139', name: 'Nguyễn Phước Thọ' },
  ]
  const teachers = [
    { id: 'GV01', name: 'PGS.TS. Nguyễn Đình Hiển' }
  ]

  useEffect(() => {
    function handleClickOutside(event) {
      if (memberRef.current && !memberRef.current.contains(event.target)) {
        setShowMembers(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [memberRef])

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
          G14 AI Hub
        </h1>
        <button 
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FontAwesomeIcon icon={faBars} className="text-lg" />
        </button>
      </div>

      {/* Filter Section */}
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

      {/* Footer Interactive */}
      {!isCollapsed && (
        <div 
          ref={memberRef}
          className="relative border-t border-gray-700 bg-gray-900/50 flex-shrink-0"
        >
          {/* Member List Popup */}
          {showMembers && (
            <div className="absolute bottom-full left-0 w-full mb-2 px-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-3">
                {/* Phần Sinh viên */}
                <div className="text-[10px] text-gray-400 font-semibold mb-2 uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} /> Thành viên nhóm
                </div>
                <div className="space-y-2">
                  {members.map(member => (
                    <div key={member.id} className="flex justify-between items-center text-xs pb-2 border-b border-gray-700 last:border-0 last:pb-0">
                      <span className="text-gray-200 font-medium">{member.name}</span>
                      <span className="text-gray-400 font-mono bg-black/20 px-1.5 py-0.5 rounded text-[10px]">
                        {member.id}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Phần Giáo viên - Đã chỉnh sửa khoảng cách */}
                <div className="mt-4 pt-3 border-t border-gray-600/50">
                  <div className="text-[10px] text-gray-400 font-semibold mb-2 uppercase tracking-wider flex items-center gap-2">
                    <FontAwesomeIcon icon={faGraduationCap} /> Giáo viên hướng dẫn
                  </div>
                  <div className="space-y-2">
                    {teachers.map(teacher => (
                      <div key={teacher.id} className="flex justify-between items-center text-xs pb-2 border-b border-gray-700 last:border-0 last:pb-0">
                        <span className="text-blue-300 font-medium">{teacher.name}</span>
                        {/* Ẩn ID giáo viên hoặc hiển thị icon khác nếu cần */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Arrow down */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-slate-800 border-b border-r border-slate-600 rotate-45"></div>
            </div>
          )}

          {/* Trigger Button */}
          <button 
            onClick={() => setShowMembers(!showMembers)}
            className={`
              w-full p-3 flex flex-col gap-1 text-left transition-colors
              ${showMembers ? 'bg-white/10' : 'hover:bg-white/5'}
            `}
          >
            <div className="flex justify-between w-full text-[10px] text-gray-500">
               <span>{safeTopics.length} chủ đề</span>
               <span>v1.2</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[9px] uppercase tracking-wider text-blue-400 font-semibold">
                 CITD - TTNT - Group 14
              </div>
              <FontAwesomeIcon 
                icon={faUsers} 
                className={`text-xs transition-transform duration-200 ${showMembers ? 'text-blue-400 scale-110' : 'text-gray-600'}`} 
              />
            </div>
          </button>
        </div>
      )}
    </aside>
  )
}