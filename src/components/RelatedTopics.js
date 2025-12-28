'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function RelatedTopics({ relatedTopics, loading, onTopicClick }) {
  if (loading) {
    return (
      <div className="mt-4 sm:mt-6 md:mt-8 xl:mt-10 3xl:mt-12 4xl:mt-16 5xl:mt-20 p-4 sm:p-5 md:p-6 xl:p-8 3xl:p-10 4xl:p-12 5xl:p-16 bg-white rounded-lg border border-border-color">
        <div className="flex items-center justify-center py-6 sm:py-8 xl:py-10 3xl:py-12 4xl:py-16 5xl:py-20">
          <FontAwesomeIcon icon={faSpinner} className="text-primary text-xl sm:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl animate-spin" />
          <span className="ml-3 text-xs sm:text-sm xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl text-text-secondary">Đang tải topics liên quan...</span>
        </div>
      </div>
    )
  }

  if (!relatedTopics || relatedTopics.length === 0) {
    return null
  }

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 xl:mt-10 3xl:mt-12 4xl:mt-16 5xl:mt-20 p-4 sm:p-5 md:p-6 xl:p-8 3xl:p-10 4xl:p-12 5xl:p-16 bg-white rounded-lg border border-border-color">
      <div className="flex items-center gap-2 3xl:gap-3 4xl:gap-4 5xl:gap-5 mb-3 sm:mb-4 xl:mb-5 3xl:mb-6 4xl:mb-8 5xl:mb-10">
        <FontAwesomeIcon icon={faLink} className="text-primary text-sm sm:text-base xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl" />
        <h3 className="text-base sm:text-lg xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl font-semibold text-text-primary">Topics liên quan</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7 gap-2 sm:gap-3 xl:gap-4 3xl:gap-5 4xl:gap-6 5xl:gap-8">
        {relatedTopics.filter(topic => topic && topic.id).map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicClick(topic.id)}
            className="p-3 sm:p-4 xl:p-5 3xl:p-6 4xl:p-8 5xl:p-10 bg-white border-2 border-border-color rounded-lg hover:border-primary hover:shadow-md transition-all text-left group"
          >
            <h4 className="text-sm sm:text-base xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl font-semibold text-text-primary group-hover:text-primary transition-colors mb-1 sm:mb-2 xl:mb-3 3xl:mb-4 4xl:mb-5 5xl:mb-6">
              {topic.title || 'Untitled'}
            </h4>
            <p className="text-xs sm:text-sm xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl text-text-secondary line-clamp-2">
              {topic.short_definition || 'No description'}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
