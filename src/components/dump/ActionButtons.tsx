import React from 'react'
import { Button } from '../common/Button'

interface ActionButtonsProps {
  onSave: () => void
  onGenerateIdeas: () => void
  onClear: () => void
  saveLoading?: boolean
  generateLoading?: boolean
  canGenerateIdeas: boolean
  hasContent: boolean
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onGenerateIdeas,
  onClear,
  saveLoading = false,
  generateLoading = false,
  canGenerateIdeas,
  hasContent
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={onSave}
        loading={saveLoading}
        disabled={!hasContent || saveLoading}
      >
        Save Dump
      </Button>

      <Button
        onClick={onGenerateIdeas}
        variant="secondary"
        loading={generateLoading}
        disabled={!hasContent || !canGenerateIdeas || generateLoading}
      >
        Generate Ideas
      </Button>

      <Button
        onClick={onClear}
        variant="ghost"
        disabled={!hasContent}
      >
        Clear
      </Button>
    </div>
  )
}
