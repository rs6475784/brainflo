import { formatDistanceToNow, format } from 'date-fns'

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, 'MMM d, yyyy')
}

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, 'MMM d, yyyy h:mm a')
}

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  return formatDistanceToNow(date, { addSuffix: true })
}

export const formatWordCount = (count: number): string => {
  return `${count} word${count !== 1 ? 's' : ''}`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
