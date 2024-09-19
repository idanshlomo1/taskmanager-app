"use client"

import { useClerk, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Settings, Shield, UserCircle } from "lucide-react"

export default function AccountPage() {
  const { signOut, openUserProfile } = useClerk()

  return (
    <main className="h-full pt-12 md:pt-0">
      <div className="w-full h-[80vh] border flex flex-col bg-background rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-3xl font-bold tracking-tight">Account Details</h1>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
              </Button>
            </Link>
            <UserButton />
          </div>
        </div>
        <div className="flex-grow p-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" /> Profile Information
              </CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => openUserProfile()} className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" /> Account Settings
              </CardTitle>
              <CardDescription>Configure your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Settings
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> Security
              </CardTitle>
              <CardDescription>Update your security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Security Options
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" /> Sign Out
              </CardTitle>
              <CardDescription>Securely log out of your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => signOut()} variant="destructive" className="w-full">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}