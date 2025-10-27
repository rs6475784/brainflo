import React from 'react'
import { LoadingSpinner } from '../common/LoadingSpinner'
import type { GeneratedIdeas as GeneratedIdeasType } from '../../lib/types'

interface GeneratedIdeasProps {
  ideas: GeneratedIdeasType | null
  loading: boolean
}

export const GeneratedIdeas: React.FC<GeneratedIdeasProps> = ({ ideas, loading }) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#e5e5e5] rounded-lg p-8 flex justify-center">
        <LoadingSpinner text="Generating content ideas..." />
      </div>
    )
  }

  if (!ideas) {
    return null
  }

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold">Generated Content Ideas</h3>

      {/* Tweet Ideas */}
      {ideas.tweet_ideas && ideas.tweet_ideas.length > 0 && (
        <div>
          <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
            <span>□</span> Tweet Ideas
          </h4>
          <ul className="space-y-2">
            {ideas.tweet_ideas.map((idea, index) => (
              <li
                key={index}
                className="bg-[#fafafa] border border-[#e5e5e5] rounded-md p-3 text-sm"
              >
                {idea}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Thread Ideas */}
      {ideas.thread_ideas && ideas.thread_ideas.length > 0 && (
        <div>
          <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
            <span>≡</span> Thread Ideas
          </h4>
          <div className="space-y-3">
            {ideas.thread_ideas.map((thread, index) => (
              <div
                key={index}
                className="bg-[#fafafa] border border-[#e5e5e5] rounded-md p-4 space-y-2"
              >
                <div className="font-medium text-base">{thread.title}</div>
                <div className="text-sm text-[#737373]">
                  <span className="font-medium text-black">Hook:</span> {thread.hook}
                </div>
                <div className="text-sm text-[#737373]">
                  <span className="font-medium text-black">Arc:</span> {thread.arc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Longform Ideas */}
      {ideas.longform_ideas && ideas.longform_ideas.length > 0 && (
        <div>
          <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
            <span>◐</span> Long-form Post Ideas
          </h4>
          <div className="space-y-3">
            {ideas.longform_ideas.map((longform, index) => (
              <div
                key={index}
                className="bg-[#fafafa] border border-[#e5e5e5] rounded-md p-4 space-y-2"
              >
                <div className="font-medium text-base">{longform.title}</div>
                <div className="text-sm text-[#737373]">
                  <span className="font-medium text-black">Theme:</span> {longform.theme}
                </div>
                <div className="text-sm text-[#737373]">
                  <span className="font-medium text-black">Structure:</span> {longform.structure}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
