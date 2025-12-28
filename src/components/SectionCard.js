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
    <div className="p-3 sm:p-4 md:p-6 xl:p-8 3xl:p-10 4xl:p-12 5xl:p-16 bg-white rounded-lg border border-border-color shadow-sm">
      {/* Heading */}
      {section.heading && (
        <h3 className="text-lg sm:text-xl md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl font-bold text-text-primary mb-3 sm:mb-4 xl:mb-5 3xl:mb-6 4xl:mb-8 5xl:mb-10">
          {section.heading}
        </h3>
      )}

      {/* Content */}
      {section.content && (
        <div 
          className="text-sm sm:text-base xl:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl text-text-primary mb-3 sm:mb-4 xl:mb-5 3xl:mb-6 4xl:mb-8 5xl:mb-10 leading-relaxed prose prose-sm sm:prose-base xl:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: escapeHtml(section.content) }}
        />
      )}

      {/* Image */}
      {section.image_url && (
        <img 
          src={section.image_url} 
          alt={section.heading || 'Image'} 
          className="w-full rounded-lg mb-3 sm:mb-4 xl:mb-5 3xl:mb-6 4xl:mb-8 5xl:mb-10 object-cover"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}

      {/* Code Snippet */}
      {section.code_snippet && (
        <div className="mt-3 sm:mt-4 xl:mt-5 3xl:mt-6 4xl:mt-8 5xl:mt-10">
          <div className="flex items-center justify-between bg-gray-800 text-white px-3 sm:px-4 xl:px-5 3xl:px-6 4xl:px-8 5xl:px-10 py-2 xl:py-3 3xl:py-4 4xl:py-5 5xl:py-6 rounded-t-lg">
            <span className="text-xs sm:text-sm xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl">Code Example</span>
            <span className="text-[10px] sm:text-xs xl:text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl bg-primary px-2 xl:px-3 3xl:px-4 4xl:px-5 5xl:px-6 py-1 3xl:py-1.5 4xl:py-2 rounded">
              {(section.language || 'plaintext').toUpperCase()}
            </span>
          </div>
          <pre className="bg-gray-900 rounded-b-lg overflow-x-auto">
            <code 
              ref={codeRef}
              className={`language-${section.language || 'plaintext'} text-xs sm:text-sm xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl block`}
            >
              {section.code_snippet}
            </code>
          </pre>
        </div>
      )}
    </div>
  )
}