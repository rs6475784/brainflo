import React from 'react'
import { useTimer } from '../../hooks/useTimer'

export const TimerControls: React.FC = () => {
  const { formattedTime, isActive, start, stop, reset } = useTimer()

  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl font-mono font-semibold tabular-nums">
        {formattedTime}
      </div>
      <div className="flex gap-2">
        {!isActive ? (
          <button
            onClick={start}
            className="px-3 py-1.5 text-sm bg-white border border-[#d4d4d4] rounded-md hover:bg-[#fafafa] transition-colors"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stop}
            className="px-3 py-1.5 text-sm bg-white border border-[#d4d4d4] rounded-md hover:bg-[#fafafa] transition-colors"
          >
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="px-3 py-1.5 text-sm bg-white border border-[#d4d4d4] rounded-md hover:bg-[#fafafa] transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
