"use client"

import React, { useState } from 'react'
import { UserCircle, LogOut, ArrowLeft, Loader2, Mail } from 'lucide-react'
import { useClerk, useUser } from '@clerk/nextjs'
import Link from 'next/link'
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
    <main className="h-full pt-4 px-4 md:pt-8 md:px-6">
      <div className="w-full max-w-3xl mx-auto h-[calc(100vh-2rem)] md:h-[80vh] border flex flex-col bg-background/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-4 sm:mb-0">Account Details</h1>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto text-primary hover:bg-primary/10">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go to All Tasks
            </Button>
          </Link>
        </div>
        <ScrollArea className="flex-grow p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-background/80 backdrop-blur-sm shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage className="object-cover" src={user?.imageUrl} alt={user?.fullName || 'User'} />
                  <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <CardTitle className="text-xl sm:text-2xl text-primary">{user?.fullName}</CardTitle>
                  <CardDescription className="text-muted-foreground flex items-center justify-center sm:justify-start mt-1">
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
                <span className="flex items-center justify-center">
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
        <div className="flex-1">
          <CardTitle className="text-primary text-lg sm:text-xl">{title}</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
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