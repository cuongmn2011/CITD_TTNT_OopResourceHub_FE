'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function RelatedTopics({ relatedTopics, loading, onTopicClick }) {
  if (loading) {
    return (
      <div className="mt-8 p-6 bg-white rounded-lg border border-border-color">
        <div className="flex items-center justify-center py-8">
          <FontAwesomeIcon icon={faSpinner} className="text-primary text-2xl animate-spin" />
          <span className="ml-3 text-text-secondary">Đang tải topics liên quan...</span>
        </div>
      </div>
    )
  }

  if (!relatedTopics || relatedTopics.length === 0) {
    return null
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg border border-border-color">
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faLink} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Topics liên quan</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {relatedTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicClick(topic.id)}
            className="p-4 bg-white border-2 border-border-color rounded-lg hover:border-primary hover:shadow-md transition-all text-left group"
          >
            <h4 className="font-semibold text-text-primary group-hover:text-primary transition-colors mb-2">
              {topic.title}
            </h4>
            <p className="text-sm text-text-secondary line-clamp-2">
              {topic.short_definition}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
