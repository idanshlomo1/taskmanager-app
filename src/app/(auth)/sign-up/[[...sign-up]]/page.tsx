'use client'

import { useState, useEffect } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { z } from 'zod'
import { ArrowRight, Loader2 } from 'lucide-react'

// Zod schema for form validation
const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Handle form submission for sign up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setErrors({})

    try {
      // Validate form data using Zod
      const validatedData = signUpSchema.parse(formData)

      // Create sign-up using Clerk
      await signUp.create({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        emailAddress: validatedData.email,
        password: validatedData.password,
      })

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setVerifying(true)
    } catch (err) {
      // Handle Zod validation errors
      if (err instanceof z.ZodError) {
        const fieldErrors = err.flatten().fieldErrors
        const simplifiedErrors: Record<string, string> = {}
        for (const key in fieldErrors) {
          if (fieldErrors[key]) {
            simplifiedErrors[key] = fieldErrors[key]![0]
          }
        }
        setErrors(simplifiedErrors)
      } 
      // Handle Clerk API errors
      else if (err instanceof Error && 'errors' in err) {
        const clerkError = err as { errors: { message: string }[] }
        const errorMessage = clerkError.errors[0].message

        // Map Clerk-specific error messages
        if (errorMessage.toLowerCase().includes('weak password')) {
          setErrors({ password: 'Your password is too weak. Please choose a stronger one.' })
        } else if (errorMessage.toLowerCase().includes('data breach')) {
          setErrors({ password: 'This password has been found in a data breach. Please use a different one.' })
        } else if (errorMessage.toLowerCase().includes('email address is already taken')) {
          setErrors({ email: 'This email address is already registered. Please use another email.' })
        } else {
          // Default error message for Clerk errors
          setErrors({ form: errorMessage || 'An unexpected error occurred. Please try again.' })
        }
      } 
      // Handle unexpected errors
      else {
        console.error('Unexpected Error:', err)
        setErrors({ form: 'An unexpected error occurred. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle email verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setErrors({})

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.push('/')
      } else {
        setErrors({ form: 'Verification failed. Please try again.' })
      }
    } catch (err: unknown) {
      if (err instanceof Error && 'errors' in err) {
        const clerkError = err as { errors: { message: string }[] }
        setErrors({ form: clerkError.errors[0].message || 'Verification failed. Please try again.' })
      } else {
        setErrors({ form: 'Verification failed. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-36 flex items-center w-full animated-gradient justify-center px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="z-10 w-full max-w-md"
          >
            <Card className="backdrop-blur-lg bg-background/80 shadow-xl border-0">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
                  {verifying ? 'Verify Email' : 'Sign Up'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground">
                  {verifying ? 'Enter the code sent to your email' : 'Create your account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {verifying ? (
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Verification Code</Label>
                      <Input
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter verification code"
                        className="bg-background/50 border-primary/20"
                      />
                    </div>
                    {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
                    <Button className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 inline-block transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          className="bg-background/50 border-primary/20"
                        />
                        {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          className="bg-background/50 border-primary/20"
                        />
                        {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className="bg-background/50 border-primary/20"
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="bg-background/50 border-primary/20"
                      />
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="bg-background/50 border-primary/20"
                      />
                      {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                    </div>
                    {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
                    <Button className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing Up...
                        </>
                      ) : (
                        <>
                          Sign Up
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 inline-block transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/sign-in" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
