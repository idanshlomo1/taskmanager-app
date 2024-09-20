'use client'

import * as React from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function EnhancedSignUp() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [formData, setFormData] = React.useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [verifying, setVerifying] = React.useState(false)
  const [code, setCode] = React.useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    try {
      const validatedData = signUpSchema.parse(formData)

      await signUp.create({
        emailAddress: validatedData.email,
        username: validatedData.username,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        password: validatedData.password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setVerifying(true)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = err.flatten().fieldErrors
        const simplifiedErrors: Record<string, string> = {}
        for (const key in fieldErrors) {
          if (fieldErrors[key]) {
            simplifiedErrors[key] = fieldErrors[key]![0]
          }
        }
        setErrors(simplifiedErrors)
      } else {
        console.error('Clerk Error:', err)
        setErrors({ form: 'An unexpected error occurred' })
      }
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

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
    } catch (err: any) {
      setErrors({ form: err.errors?.[0]?.message || 'Verification failed. Please try again.' })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      <div className="w-full max-w-6xl flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden">
        <motion.div
          className="w-full md:w-1/2  bg-gradient-to-tr from-blue-500 to-blue-400 p-12 flex flex-col justify-center items-center text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Task Manager</h1>
          <p className="text-xl mb-8">Join us and start organizing your tasks efficiently</p>
          <img
            src="/is-logo.svg"
            alt="Task Manager Banner"
            className="rounded-xl w-24"
          />
        </motion.div>
        <motion.div
          className="w-full md:w-1/2 bg-background p-12"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-3xl">{verifying ? 'Verify Email' : 'Sign Up'}</CardTitle>
              <CardDescription>
                {verifying ? 'Enter the code sent to your email' : 'Create your Task Manager account'}
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
                    />
                  </div>
                  {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
                  <Button className="w-full" type="submit">Verify</Button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { id: 'email', label: 'Email', type: 'email' },
                    { id: 'username', label: 'Username', type: 'text' },
                    { id: 'firstName', label: 'First name', type: 'text' },
                    { id: 'lastName', label: 'Last name', type: 'text' },
                    { id: 'password', label: 'Password', type: 'password' },
                    { id: 'confirmPassword', label: 'Confirm Password', type: 'password' },
                  ].map(({ id, label, type }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>{label}</Label>
                      <Input
                        id={id}
                        name={id}
                        type={type}
                        value={formData[id as keyof typeof formData]}
                        onChange={handleChange}
                        placeholder={`Enter your ${label.toLowerCase()}`}
                      />
                      {errors[id] && <p className="text-sm text-destructive">{errors[id]}</p>}
                    </div>
                  ))}
                  {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
                  <Button className="w-full" type="submit">Sign Up</Button>
                </form>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground text-center w-full">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}