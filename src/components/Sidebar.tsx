"use client"

import { cn } from "@/lib/utils"
import { Home, List, CheckIcon, XIcon, LogOutIcon, MenuIcon, LucideFileQuestion, ShieldQuestion, Calendar } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useUser } from "@clerk/nextjs"
import { ModeToggle } from "./ModeToggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
    { id: 1, title: "All Tasks", icon: <Home size={20} />, link: "/" },
    { id: 2, title: "Calendar", icon: <Calendar size={20} />, link: "/calendar" },
    { id: 3, title: "Important", icon: <List size={20} />, link: "/important" },
    { id: 4, title: "Completed", icon: <CheckIcon size={20} />, link: "/completed" },
    { id: 5, title: "Incomplete", icon: <XIcon size={20} />, link: "/incomplete" },
]

export default function Component() {
    const pathName = usePathname()
    const { user } = useUser()
    const { firstName, lastName, imageUrl } = user || {}
    const router = useRouter()

    return (
        <nav>
            <div className="hidden md:flex md:flex-col h-full md:w-64 rounded-lg border-r overflow-hidden bg-background/80 backdrop-blur-sm shadow-sm">
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                        <div className="flex items-center space-x-4">
                            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/account')}>
                                <AvatarImage className="object-cover" src={imageUrl} alt="Profile" />
                                <AvatarFallback>{firstName?.charAt(0)}{lastName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-primary">{firstName} {lastName}</p>
                                <p className="text-sm text-muted-foreground">{user?.username || 'Task Manager'}</p>
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
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
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
                            className="w-full justify-start space-x-2 hover:bg-primary/10 hover:text-primary"
                            onClick={() => router.push('/guide')}
                        >
                            <ShieldQuestion size={20} />
                            <span>How to use the app</span>
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
                                            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/account')}>
                                                <AvatarImage className="object-cover" src={imageUrl} alt="Profile" />
                                                <AvatarFallback>{firstName?.charAt(0)}{lastName?.charAt(0)}</AvatarFallback>
                                            </Avatar>
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
                                    <SheetClose asChild>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start space-x-2"
                                            onClick={() => router.push('/guide')}
                                        >
                                            <ShieldQuestion size={20} />
                                            <span>How to use the app</span>
                                        </Button>
                                    </SheetClose>
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