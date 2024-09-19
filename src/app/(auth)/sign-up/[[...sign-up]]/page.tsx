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

// Schema definition with validation rules
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

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [formData, setFormData] = React.useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({}); // Simplified to single message per field
  const [verifying, setVerifying] = React.useState(false)
  const [code, setCode] = React.useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
  
    try {
      const validatedData = signUpSchema.parse(formData);
  
      await signUp.create({
        emailAddress: validatedData.email,
        username: validatedData.username,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        password: validatedData.password,
      });
  
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerifying(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = err.flatten().fieldErrors;
        const simplifiedErrors: Record<string, string> = {};
        for (const key in fieldErrors) {
          if (fieldErrors[key]) {
            simplifiedErrors[key] = fieldErrors[key]![0];
          }
        }
        setErrors(simplifiedErrors);
      } else {
        // Log the full error response from Clerk for debugging
        console.error('Clerk Error:', err);
        setErrors({ form: 'An unexpected error occurred' });
      }
    }
  };
  
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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>{verifying ? 'Verify Email' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {verifying ? 'Enter the code sent to your email' : 'Create your Task Manager account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {verifying ? (
              <form onSubmit={handleVerify}>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter verification code"
                  />
                </div>
                {errors.form && <p className="text-sm text-destructive mt-2">{errors.form}</p>}
                <Button className="w-full mt-4" type="submit">Verify</Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  {['email', 'username', 'firstName', 'lastName', 'password', 'confirmPassword'].map((field) => (
                    <div key={field} className="flex flex-col space-y-1.5">
                      <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      <Input
                        id={field}
                        name={field}
                        type={field.includes('password') ? 'password' : 'text'}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        placeholder={`Enter your ${field}`}
                      />
                      {errors[field] && <p className="text-sm text-destructive">{errors[field]}</p>}
                    </div>
                  ))}
                </div>
                {errors.form && <p className="text-sm text-destructive mt-2">{errors.form}</p>}
                <Button className="w-full mt-4" type="submit">Sign Up</Button>
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
  )
}
