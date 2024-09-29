"use client"

import React, { useState } from 'react'
import { UserCircle, LogOut, ArrowLeft, Loader2, Mail } from 'lucide-react'
import { useClerk, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AccountPage() {
  const { signOut, openUserProfile } = useClerk()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="h-full pt-12 md:pt-0">
      <div className="w-full h-[80vh] border flex flex-col bg-background/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Account Details</h1>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-primary hover:bg-primary/10">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go to All Tasks
              </Button>
            </Link>
          </div>
        </div>
        <ScrollArea className="flex-grow p-6">
          <div className="space-y-6">
            <Card className="bg-background/80 backdrop-blur-sm shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage className="object-cover" src={user?.imageUrl} alt={user?.fullName || 'User'} />
                  <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-primary">{user?.fullName}</CardTitle>
                  <CardDescription className="text-muted-foreground flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {user?.primaryEmailAddress?.emailAddress}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <AccountItem
              icon={<UserCircle className="h-6 w-6 text-primary" />}
              title="Profile Information"
              description="Manage your personal details"
              buttonText="Edit Profile"
              onClick={openUserProfile}
            />
            <AccountItem
              icon={<LogOut className="h-6 w-6 text-destructive" />}
              title="Sign Out"
              description="Securely log out of your account"
              buttonText={
                <span className="flex items-center">
                  Sign Out
                  {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </span>
              }
              onClick={handleSignOut}
              variant="destructive"
              disabled={isLoading}
            />
          </div>
        </ScrollArea>
      </div>
    </main>
  )
}

interface AccountItemProps {
  icon: React.ReactNode
  title: string
  description: string
  buttonText: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'destructive'
  disabled?: boolean
}

function AccountItem({ icon, title, description, buttonText, onClick, variant = 'default', disabled = false }: AccountItemProps) {
  return (
    <Card className="bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        {icon}
        <div>
          <CardTitle className="text-primary">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onClick} 
          variant={variant} 
          className={`w-full ${variant === 'default' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`} 
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}