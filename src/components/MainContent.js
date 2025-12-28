'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faInbox } from '@fortawesome/free-solid-svg-icons'
import SectionCard from './SectionCard'
import RelatedTopics from './RelatedTopics'

export default function MainContent({ 
  topicTitle, 
  sections, 
  selectedTopicId,
  selectedTopic,
  relatedTopics,
  loadingRelated,
  onTopicClick
}) {
  return (
    <main className="flex-1 flex flex-col min-w-0">
      {/* Header Compact - Giảm padding và font size */}
      <header className="bg-white shadow-sm p-3 sm:p-4 md:p-5 xl:p-6 3xl:p-8 4xl:p-10 5xl:p-12 border-b border-border-color flex-shrink-0">
        <h2 className="text-lg sm:text-xl md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl font-bold text-text-primary mb-2 3xl:mb-3 4xl:mb-4 leading-tight">
          {topicTitle}
        </h2>
        
        {/* Tags */}
        {selectedTopic?.tags && selectedTopic.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 3xl:gap-2 4xl:gap-2.5">
            {selectedTopic.tags.map(tag => (
              <span 
                key={tag.id}
                className="inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs 3xl:text-sm 4xl:text-base font-medium
                         bg-blue-50 text-blue-700 rounded-full border border-blue-200
                         hover:bg-blue-100 transition-colors cursor-pointer"
                title={tag.description || tag.name}
              >
                <span className="mr-1 opacity-70">🏷️</span>
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 xl:p-8 3xl:p-10 4xl:p-12 5xl:p-16 custom-scrollbar">
        {!selectedTopicId ? (
          <div className="text-center py-12 sm:py-16 md:py-20 px-4">
            <FontAwesomeIcon icon={faInbox} className="text-3xl sm:text-4xl text-gray-300 mb-3" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-600 mb-1">Chọn một topic để bắt đầu</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Sử dụng sidebar bên trái hoặc search bar phía trên
            </p>
          </div>
        ) : !sections || sections.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 px-4">
            <FontAwesomeIcon icon={faInbox} className="text-3xl sm:text-4xl text-gray-300 mb-3" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-600 mb-1">Chưa có nội dung</h3>
            <p className="text-xs sm:text-sm text-gray-400">Topic này chưa có sections</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 xl:gap-8 3xl:gap-10 4xl:gap-12 5xl:gap-16 w-full max-w-4xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-[260rem] 4xl:max-w-[260rem] 5xl:max-w-[260rem] mx-auto px-0 sm:px-2 xl:px-4 3xl:px-6 4xl:px-8 5xl:px-12">
            {sections
              .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
              .map((section, index) => (
                <SectionCard key={section.id || index} section={section} />
              ))
            }
            
            {/* Related Topics Section */}
            <div className="pt-3 sm:pt-4 xl:pt-6 3xl:pt-8 4xl:pt-10 5xl:pt-12 border-t border-gray-100 mt-3 sm:mt-4 xl:mt-6 3xl:mt-8 4xl:mt-10 5xl:mt-12">
               <RelatedTopics 
                relatedTopics={relatedTopics}
                loading={loadingRelated}
                onTopicClick={(topicId) => {
                  const topic = relatedTopics.find(t => t.id === topicId)
                  if (topic) {
                    onTopicClick(topicId, topic.title)
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}