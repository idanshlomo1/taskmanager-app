"use client"

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useClerk, useUser } from '@clerk/nextjs'
import { Loader2, LogOut, UserCircle, Camera } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from '@/hooks/use-toast'

export default function AccountPage() {
  const { signOut, openUserProfile } = useClerk()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdatingPicture, setIsUpdatingPicture] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleChangeProfilePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUpdatingPicture(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await user?.setProfileImage({ file })
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      })
    } catch (error) {
      console.error('Error updating profile picture:', error)
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPicture(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"

      />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage className='object-cover' src={user?.imageUrl} alt={user?.fullName || "User"} />
            <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-primary">{user?.fullName}</h1>
          <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
        </motion.div>

        <motion.div
          className="space-y-6 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AccountItem
            icon={<UserCircle className="h-6 w-6" />}
            title="Profile Information"
            description="Manage your personal details and preferences"
            buttonText="Edit Profile"
            onClick={openUserProfile}
          />
          <AccountItem
            icon={<Camera className="h-6 w-6" />}
            title="Change Profile Picture"
            description="Update your profile picture"
            buttonText={
              <span className="flex items-center justify-center">
                {isUpdatingPicture ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>Change Picture</>
                )}
              </span>
            }
            onClick={() => fileInputRef.current?.click()}
            disabled={isUpdatingPicture}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChangeProfilePicture}
            accept="image/*"
            className="hidden"
          />
          <AccountItem
            icon={<LogOut className="h-6 w-6" />}
            title="Sign Out"
            description="Securely log out of your account"
            buttonText={
              <span className="flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing Out...
                  </>
                ) : (
                  <>Sign Out</>
                )}
              </span>
            }
            onClick={handleSignOut}
            variant="destructive"
            disabled={isLoading}
          />
        </motion.div>
      </div>
    </div>
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
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="p-2 rounded-full bg-primary/10">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onClick}
            variant={variant}
            className="w-full transition-all duration-200 ease-in-out hover:shadow-lg"
            disabled={disabled}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}