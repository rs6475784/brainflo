import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../common/Button'
import { validateEmail } from '../../utils/validation'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!password) {
      setError('Please enter your password')
      return
    }

    setLoading(true)

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setError(signInError)
      setLoading(false)
    } else {
      navigate('/')
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
      </div>

      <Button type="submit" fullWidth loading={loading}>
        Sign In
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
        Sign in with Google
      </Button>

      <p className="text-center text-sm text-[#737373] mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-black font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
