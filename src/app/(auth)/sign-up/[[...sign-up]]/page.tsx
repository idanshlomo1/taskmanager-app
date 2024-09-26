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
import { Loader2 } from 'lucide-react'

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
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setErrors({})

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
    } finally {
      setIsLoading(false)
    }
  }

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
    } catch (err: any) {
      setErrors({ form: err.errors?.[0]?.message || 'Verification failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden pt-24 pb-12">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(244,114,182,0.15) 100%)',
            'radial-gradient(circle, rgba(129,140,248,0.15) 0%, rgba(236,72,153,0.15) 100%)',
            'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(244,114,182,0.15) 100%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full bg-background/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  {verifying ? 'Verify Email' : 'Sign Up'}
                </CardTitle>
                <CardDescription className="text-center">
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
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify'
                      )}
                    </Button>
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
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing Up...
                        </>
                      ) : (
                        'Sign Up'
                      )}
                    </Button>
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
    </div>
  )
}