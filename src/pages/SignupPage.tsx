import React from 'react'
import { AuthLayout } from '../components/auth/AuthLayout'
import { SignupForm } from '../components/auth/SignupForm'

export const SignupPage: React.FC = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start capturing your thoughts and generating content ideas"
    >
      <SignupForm />
    </AuthLayout>
  )
}
