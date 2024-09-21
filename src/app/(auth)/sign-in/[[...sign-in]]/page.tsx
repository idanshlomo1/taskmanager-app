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

export default function EnhancedSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [emailOrUsername, setEmailOrUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

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
    }
  }

  // const handleGoogleSignIn = () => {
  //   if (!isLoaded) return
  //   signIn.authenticateWithRedirect({
  //     strategy: 'oauth_google',
  //     redirectUrl: '/sso-callback',
  //     redirectUrlComplete: '/'
  //   })
  // }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      <div className="w-full max-w-6xl flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden">
        <motion.div
          className=" w-full md:w-1/2  bg-gradient-to-tr from-blue-500 to-blue-400 p-12 flex flex-col justify-center items-center text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Task Manager</h1>
          <p className="text-xl mb-8">Organize your tasks efficiently</p>
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
            <CardHeader >
              <CardTitle className="text-3xl">Sign In</CardTitle>
              <CardDescription>Welcome back to Task Manager</CardDescription>
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
                <Button className="w-full" type="submit">Sign In</Button>
              </form>
              <div className="mt-4 text-right">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              {/* <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <FcGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
              <GoogleOneTap /> */}
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
  )
}