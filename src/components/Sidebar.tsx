"use client"

import { cn } from "@/lib/utils"
import { Home, List, CheckIcon, XIcon, LogOutIcon, MenuIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useClerk, useUser } from "@clerk/nextjs"
import { ModeToggle } from "./ModeToggle"

const navItems = [
    { id: 1, title: "All Tasks", icon: <Home size={20} />, link: "/" },
    { id: 2, title: "Important", icon: <List size={20} />, link: "/important" },
    { id: 3, title: "Completed", icon: <CheckIcon size={20} />, link: "/completed" },
    { id: 4, title: "Incomplete", icon: <XIcon size={20} />, link: "/incomplete" },
]

export default function Component() {
    const pathName = usePathname()
    const { signOut, openUserProfile } = useClerk()
    const { user } = useUser()
    const { firstName, lastName, imageUrl } = user || {}


    return (
        <nav>
            <div className="hidden md:flex md:flex-col h-full md:w-64 rounded-lg border overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                        <div className="flex items-center space-x-4">
                            <Image
                                src={imageUrl || "/placeholder.svg?height=48&width=48"}
                                alt="Profile"
                                width={48}
                                height={48}
                                className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => openUserProfile()}
                            />
                            <div>
                                <p className="font-medium">{firstName} {lastName}</p>
                                <p className="text-sm text-muted-foreground">Task Manager</p>
                            </div>
                        </div>
                    </div>
                    <ul className="flex-1 overflow-y-auto py-2">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    href={item.link}
                                    className={cn(
                                        "flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                        item.link === pathName
                                            ? "bg-secondary text-secondary-foreground"
                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="p-4 border-t">
                        <Button
                            variant="ghost"
                            className="w-full justify-start space-x-2"
                            onClick={() => signOut({ redirectUrl: "/" })}
                        >
                            <LogOutIcon size={20} />
                            <span>Sign out</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="md:hidden">
                <div className="fixed inset-x-0 top-0 h-14 flex items-center justify-between px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40 border-b">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MenuIcon size={24} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b">
                                    <div className="flex items-center space-x-4">
                                        <SheetClose asChild>

                                            <Image
                                                src={imageUrl || "/placeholder.svg?height=48&width=48"}
                                                alt="Profile"
                                                width={48}
                                                height={48}
                                                className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => openUserProfile()}
                                            />
                                        </SheetClose>
                                        <div>
                                            <p className="font-medium">{firstName} {lastName}</p>
                                            <p className="text-sm text-muted-foreground">Task Manager</p>
                                        </div>
                                    </div>
                                </div>
                                <ul className="flex-1 overflow-y-auto py-2">

                                    {navItems.map((item) => (
                                        <li key={item.id}>
                                            <SheetClose asChild>
                                                <Link
                                                    href={item.link}
                                                    className={cn(
                                                        "flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                                        item.link === pathName
                                                            ? "bg-secondary text-secondary-foreground"
                                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
                                                    )}
                                                >
                                                    {item.icon}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SheetClose>
                                        </li>
                                    ))}
                                </ul>
                                <div className="p-4 border-t">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start space-x-2"
                                        onClick={() => signOut({ redirectUrl: "/" })}
                                    >
                                        <LogOutIcon size={20} />
                                        <span>Sign out</span>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <h1 className="text-lg font-semibold">Task Manager</h1>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    )
}