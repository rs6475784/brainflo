export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain a lowercase letter' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain an uppercase letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain a number' }
  }
  return { valid: true }
}

export const validateDumpContent = (content: string): { valid: boolean; message?: string } => {
  if (!content.trim()) {
    return { valid: false, message: 'Content cannot be empty' }
  }
  if (content.trim().length < 10) {
    return { valid: false, message: 'Content must be at least 10 characters' }
  }
  return { valid: true }
}

export const countWords = (text: string): number => {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}
