'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGraduationCap, 
  faBars, 
  faBook 
} from '@fortawesome/free-solid-svg-icons'

export default function Sidebar({ 
  topics,
  isCollapsed, 
  onToggle, 
  onSelectTopic, 
  selectedTopicId,
  loading
}) {
  return (
    <aside className={`
      bg-sidebar-bg text-white flex-shrink-0 transition-all duration-300 flex flex-col
      ${isCollapsed ? 'w-16' : 'w-sidebar'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h1 className={`font-bold text-lg ${isCollapsed ? 'hidden' : 'block'}`}>
          <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
          OOP Hub
        </h1>
        <button 
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>
      </div>

      {/* Topics List */}
      <nav className="flex-1 overflow-y-auto p-4">
        {isCollapsed ? (
          <div className="text-center text-sm text-gray-400">
            Topics
          </div>
        ) : loading ? (
          <div className="text-center text-sm text-gray-400 py-8">
            Đang tải...
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-8">
            Chưa có chủ đề nào
          </div>
        ) : (
          <div className="space-y-1">
            {topics.filter(topic => topic && topic.id).map(topic => (
              <div
                key={topic.id}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedTopicId === topic.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'hover:bg-sidebar-hover'
                  }
                `}
                onClick={() => onSelectTopic(topic.id, topic.title || 'Untitled')}
              >
                <div className="flex items-start">
                  <FontAwesomeIcon 
                    icon={faBook} 
                    className="mt-1 mr-3 text-sm flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium leading-snug mb-1">
                      {topic.title || 'Untitled'}
                    </div>
                    {/* Tags */}
                    {topic.tags && Array.isArray(topic.tags) && topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {topic.tags.filter(tag => tag && tag.id).slice(0, 2).map(tag => (
                          <span
                            key={tag.id}
                            className={`
                              text-[10px] px-2 py-0.5 rounded-full
                              ${selectedTopicId === topic.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300'
                              }
                            `}
                          >
                            #{tag.slug || tag.name || 'tag'}
                          </span>
                        ))}
                        {topic.tags.length > 2 && (
                          <span
                            className={`
                              text-[10px] px-2 py-0.5 rounded-full
                              ${selectedTopicId === topic.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300'
                              }
                            `}
                          >
                            +{topic.tags.length - 2}
                          </span>
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
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
          <div className="mb-1">📚 {topics.length} chủ đề</div>
          <div className="text-[10px]">© 2025 OOP Resource Hub</div>
        </div>
      )}
    </aside>
  )
}