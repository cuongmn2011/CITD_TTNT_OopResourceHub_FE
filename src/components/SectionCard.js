'use client'

import { useEffect, useRef } from 'react'
import hljs from 'highlight.js'

export default function SectionCard({ section }) {
  const codeRef = useRef(null)

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)
    }
  }, [section.code_snippet])

  const escapeHtml = (text) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  return (
    <div className="p-6">
      {/* Heading */}
      {section.heading && (
        <h3 className="text-xl font-bold text-text-primary mb-4">
          {section.heading}
        </h3>
      )}

      {/* Content */}
      {section.content && (
        <div 
          className="text-text-primary mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: escapeHtml(section.content) }}
        />
      )}

      {/* Image */}
      {section.image_url && (
        <img 
          src={section.image_url} 
          alt={section.heading || 'Image'} 
          className="w-full rounded-lg mb-4 object-cover"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}

      {/* Code Snippet */}
      {section.code_snippet && (
        <div className="mt-4">
          <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-t-lg">
            <span className="text-sm">Code Example</span>
            <span className="text-xs bg-primary px-2 py-1 rounded">
              {(section.language || 'plaintext').toUpperCase()}
            </span>
          </div>
          <pre className="bg-gray-900 rounded-b-lg overflow-x-auto">
            <code 
              ref={codeRef}
              className={`language-${section.language || 'plaintext'} text-sm`}
            >
              {section.code_snippet}
            </code>
          </pre>
        </div>
      )}
    </div>
  )
}