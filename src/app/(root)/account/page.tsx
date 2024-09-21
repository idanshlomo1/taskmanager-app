"use client"

import React, { useState } from 'react'
import { UserCircle, LogOut, ArrowLeft } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AccountPage() {
  const { signOut, openUserProfile } = useClerk()
  const { user } = useUser()
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
          </div>
        </div>
        <ScrollArea className="flex-grow p-6">
          <div className="space-y-4">
            <AccountItem
              icon={<UserCircle className="h-6 w-6" />}
              title="Profile Information"
              description="Manage your personal details"
              buttonText="Edit Profile"
              onClick={openUserProfile}
            />
            <AccountItem
              icon={<LogOut className="h-6 w-6" />}
              title="Sign Out"
              description="Securely log out of your account"
              buttonText="Sign Out"
              onClick={() => signOut()}
              variant="destructive"
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
  buttonText: string
  onClick: () => void
  variant?: 'default' | 'destructive'
}

function AccountItem({ icon, title, description, buttonText, onClick, variant = 'default' }: AccountItemProps) {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        {icon}
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>


      </CardHeader>
      <CardContent>
        <Button onClick={onClick} variant={variant} className="w-full">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}
