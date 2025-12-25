'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTimes } from '@fortawesome/free-solid-svg-icons'

export default function TagFilterPanel({ 
  topics, 
  selectedTags, 
  onTagsChange 
}) {
  const [allTags, setAllTags] = useState([])

  // Extract unique tags from all topics
  useEffect(() => {
    if (!topics || topics.length === 0) {
      setAllTags([])
      return
    }

    const tagMap = new Map()
    
    topics.forEach(topic => {
      if (topic.tags && Array.isArray(topic.tags)) {
        topic.tags.forEach(tag => {
          if (!tagMap.has(tag.id)) {
            tagMap.set(tag.id, tag)
          }
        })
      }
    })

    const uniqueTags = Array.from(tagMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    )
    
    setAllTags(uniqueTags)
  }, [topics])

  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId))
    } else {
      onTagsChange([...selectedTags, tagId])
    }
  }

  const clearAllTags = () => {
    onTagsChange([])
  }

  if (allTags.length === 0) {
    return null // Don't render if no tags available
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faTag} className="text-blue-600" />
          <span className="font-semibold text-gray-700">Lọc theo Tag:</span>
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={clearAllTags}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Xóa tất cả
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => {
          const isSelected = selectedTags.includes(tag.id)
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200 flex items-center gap-2
                ${isSelected 
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span>#{tag.slug}</span>
              {isSelected && (
                <FontAwesomeIcon 
                  icon={faTimes} 
                  className="text-xs" 
                />
              )}
            </button>
          )
        })}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Đã chọn {selectedTags.length} tag
        </div>
      )}
    </div>
  )
}
