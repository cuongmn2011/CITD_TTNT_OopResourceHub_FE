'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faInbox } from '@fortawesome/free-solid-svg-icons'
import SectionCard from './SectionCard'
import RelatedTopics from './RelatedTopics'

export default function MainContent({ 
  topicTitle, 
  sections, 
  selectedTopicId,
  relatedTopics,
  loadingRelated,
  onTopicClick
}) {
  return (
    <main className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <header className="bg-white shadow-sm p-6 border-b border-border-color">
        <h2 className="text-2xl font-bold text-text-primary">{topicTitle}</h2>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {!selectedTopicId ? (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faInbox} className="text-6xl text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chọn một topic để bắt đầu</h3>
            <p className="text-text-secondary">
              Sử dụng sidebar bên trái hoặc search bar phía trên
            </p>
          </div>
        ) : !sections || sections.length === 0 ? (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faInbox} className="text-6xl text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chưa có nội dung</h3>
            <p className="text-text-secondary">Topic này chưa có sections</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sections
              .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
              .map((section, index) => (
                <SectionCard key={section.id || index} section={section} />
              ))
            }
            
            {/* Related Topics Section */}
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
        )}
      </div>
    </main>
  )
}