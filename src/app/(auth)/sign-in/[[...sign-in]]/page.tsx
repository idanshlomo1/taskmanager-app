'use client'

import * as React from 'react'
import { GoogleOneTap, useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function EnhancedSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [emailOrUsername, setEmailOrUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError('')

    try {
      const result = await signIn.create({
        identifier: emailOrUsername,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/')
      } else {
        console.error('Sign in failed', result)
        setError('Sign in failed. Please check your credentials.')
      }
    } catch (err: any) {
      console.error('Error:', err.errors[0].message)
      setError(err.errors[0].message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    if (!isLoaded) return
    signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/'
    })
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
                <CardTitle className="text-3xl font-bold text-center">Sign In</CardTitle>
                <CardDescription className="text-center">Welcome back to Task Manager</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailOrUsername">Email or Username</Label>
                    <Input
                      id="emailOrUsername"
                      placeholder="Enter your email or username"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground text-center w-full">
                  Don&apos;t have an account?{' '}
                  <Link href="/sign-up" className="text-primary hover:underline">
                    Sign up
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