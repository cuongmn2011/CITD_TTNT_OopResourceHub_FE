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
      <header className="bg-white shadow-sm p-4 border-b border-border-color flex-shrink-0">
        <h2 className="text-xl font-bold text-text-primary mb-2 leading-tight">
          {topicTitle}
        </h2>
        
        {/* Tags */}
        {selectedTopic?.tags && selectedTopic.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedTopic.tags.map(tag => (
              <span 
                key={tag.id}
                className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium
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
      <div className="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar">
        {!selectedTopicId ? (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faInbox} className="text-4xl text-gray-300 mb-3" />
            <h3 className="text-base font-semibold text-gray-600 mb-1">Chọn một topic để bắt đầu</h3>
            <p className="text-sm text-gray-400">
              Sử dụng sidebar bên trái hoặc search bar phía trên
            </p>
          </div>
        ) : !sections || sections.length === 0 ? (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faInbox} className="text-4xl text-gray-300 mb-3" />
            <h3 className="text-base font-semibold text-gray-600 mb-1">Chưa có nội dung</h3>
            <p className="text-sm text-gray-400">Topic này chưa có sections</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            {sections
              .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
              .map((section, index) => (
                <SectionCard key={section.id || index} section={section} />
              ))
            }
            
            {/* Related Topics Section */}
            <div className="pt-4 border-t border-gray-100 mt-4">
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