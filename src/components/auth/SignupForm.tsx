import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../common/Button'
import { validateEmail, validatePassword } from '../../utils/validation'

export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message || 'Invalid password')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { error: signUpError } = await signUp(email, password)

    if (signUpError) {
      setError(signUpError)
      setLoading(false)
    } else {
      // Show success message and redirect to login
      navigate('/login', {
        state: { message: 'Account created! Please check your email to confirm your account.' }
      })
    }
  }

  const handleGoogleSignIn = async () => {
    const { error: googleError } = await signInWithGoogle()
    if (googleError) {
      setError(googleError)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-md p-3 text-sm text-black">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#fafafa] border border-[#e5e5e5] rounded-lg text-base focus:outline-none focus:bg-white focus:border-black transition-all"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1.5">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#fafafa] border border-[#e5e5e5] rounded-lg text-base focus:outline-none focus:bg-white focus:border-black transition-all"
          placeholder="••••••••"
          required
        />
        <p className="text-xs text-[#737373] mt-1">
          At least 8 characters with uppercase, lowercase, and number
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#fafafa] border border-[#e5e5e5] rounded-lg text-base focus:outline-none focus:bg-white focus:border-black transition-all"
          placeholder="••••••••"
          required
        />
      </div>

      <Button type="submit" fullWidth loading={loading}>
        Create Account
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e5e5e5]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-[#737373]">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={handleGoogleSignIn}
      >
        Sign up with Google
      </Button>

      <p className="text-center text-sm text-[#737373] mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-black font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
