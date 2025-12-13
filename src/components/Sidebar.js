'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGraduationCap, 
  faBars, 
  faChevronRight, 
  faFolder, 
  faBook 
} from '@fortawesome/free-solid-svg-icons'

export default function Sidebar({ 
  categories, 
  allTopics, 
  isCollapsed, 
  onToggle, 
  onSelectTopic, 
  selectedTopicId 
}) {
  const [expandedCategories, setExpandedCategories] = useState(new Set())

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {isCollapsed ? (
          <div className="text-center text-sm text-gray-400">
            Categories
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map(category => {
              const topics = allTopics[category.id] || []
              const isExpanded = expandedCategories.has(category.id)
              
              return (
                <div key={category.id} className="mb-2">
                  {/* Category Header */}
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-sidebar-hover transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <FontAwesomeIcon 
                        icon={faChevronRight} 
                        className={`mr-3 text-sm transition-transform duration-300 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                      <span className="font-semibold text-sm truncate">
                        {category.name}
                      </span>
                    </div>
                  </div>

                  {/* Topics List */}
                  <div className={`
                    overflow-hidden transition-all duration-300 bg-black/20 rounded-lg
                    ${isExpanded ? 'max-h-96 mt-1' : 'max-h-0'}
                  `}>
                    {topics.map(topic => (
                      <div
                        key={topic.id}
                        className={`
                          flex items-center p-3 ml-4 cursor-pointer rounded-lg transition-colors
                          hover:bg-sidebar-hover
                          ${selectedTopicId === topic.id ? 'bg-primary text-white' : ''}
                        `}
                        onClick={() => onSelectTopic(topic.id, topic.title)}
                      >
                        <FontAwesomeIcon icon={faBook} className="mr-3 text-sm text-primary" />
                        <span className="text-sm truncate">{topic.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </nav>
    </aside>
  )
}