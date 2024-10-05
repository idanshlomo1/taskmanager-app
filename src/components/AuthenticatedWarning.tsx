'use client'

import { useAuth, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { HomeIcon, LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AuthenticatedWarning() {
  const { isSignedIn } = useAuth()
  const { signOut } = useClerk()
  const router = useRouter()

  if (!isSignedIn) {
    return null
  }

  const handleSignOut = () => {
    signOut(() => router.push('/'))
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-100 p-4 text-yellow-800 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-center sm:text-left">You are already signed in. You don&apos;t need to be on this page.</p>
        <div className="flex gap-2">
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 hover:text-yellow-8"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Go to Home
            <span className="sr-only">Go to home page</span>
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 hover:text-yellow-800"
          >
            <LogOutIcon className="w-4 h-4 mr-2" />
            Sign Out
            <span className="sr-only">Sign out of your account</span>
          </Button>
        </div>
      </div>
    </div>
  )
}