"use client"
import { cn } from '@/lib/utils'
import { Check, Divide, Home, Icon, List, LogOutIcon, LucideLogOut, MenuIcon, Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useRef } from 'react'
import { Button } from './ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { ModeToggle } from './ModeToggle'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useClerk, UserButton, useUser } from '@clerk/nextjs'

const Sidebar = () => {
    const navItems = [
        {
            id: 1,
            title: "All Tasks",
            icon: <Home size={20} />,
            link: "/"
        },
        {
            id: 2,
            title: "Important",
            icon: <List size={20} />,
            link: "/important"
        },
        {
            id: 3,
            title: "Completed",
            icon: <Check size={20} />,
            link: "/completed"
        },
        {
            id: 4,
            title: "Do It Now",
            icon: <Pencil size={20} />,
            link: "/incomplete"
        },
    ]

    const pathName = usePathname()

    const { signOut } = useClerk()


    const { openUserProfile } = useClerk(); // Use the Clerk hook to get the openUserProfile function

    const handleOpenUserProfile = () => {
        // Open the user profile modal
        openUserProfile();
    };

    const { user } = useUser()
    const { firstName, lastName, imageUrl } = user || { firstName: "", lastName: "", imageUrl: "/" }

    return (
        <nav >
            {/* md+ screens */}
            <div className='hidden md:block h-[70vh] rounded-lg border overflow-y-auto'>
                <div className='relative h-full  p-4 flex flex-col justify-between'>



                    <div
                        className="flex gap-4 items-center justify-center py-4 rounded-lg "
                    // Add click handler here
                    >
                        <div className='h-[70px] border w-[70px] rounded-full flex items-center justify-center overflow-hidden'>
                            <Image
                                onClick={handleOpenUserProfile}
                                width={80}
                                height={80}
                                alt="profile"
                                src={`${imageUrl}`}
                                priority
                                className="rounded-full object-cover hover:opacity-80 cursor-pointer duration-200"
                            />
                        </div>

                        <p className="font-medium flex items-start flex-col">
                            <span>{firstName}</span>
                            <span>{lastName}</span>
                        </p>
                    </div>

                    <ul>
                        {navItems.map((navItem) => (
                            <li key={navItem.id}>
                                <Link
                                    className={cn('flex text-muted-foreground justify-start w-full items-center mt-4 gap-4 p-4 rounded-sm hover:bg-accent duration-200',
                                        navItem.link === pathName && 'bg-accent text-primary')}
                                    href={navItem.link}
                                >
                                    {navItem.icon}
                                    <p className='font-medium'>{navItem.title}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <Button
                        className='flex gap-2 justify-center  p-4 items-center'
                        variant={'ghost'}
                        onClick={() => signOut({ redirectUrl: '/' })}>
                        Sign out
                        <LogOutIcon size={20} />
                    </Button>
                </div>
            </div>
            {/* sm screens */}
            <div className='md:hidden flex w-full items-center fixed bg-background border-b-2  p-4 left-0 top-0 z-50'>
                <Sheet>
                    <SheetTrigger>
                        <div className='p-2 rounded-full border outline-none bg-popover focus:bg-accent hover:bg-accent hover:opacity-80 duration-200'>
                            <MenuIcon size={30} />
                        </div>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <DialogTitle className='font-bold'>Task Manager</DialogTitle>
                        <div className='relative w-full h-full rounded-lg px-4 py-12 flex flex-col justify-between'>
                            <SheetClose>
                                <div
                                    className="flex gap-4 items-center justify-center py-4 rounded-lg hover:opacity-80 cursor-pointer duration-200"
                                    onClick={handleOpenUserProfile}
                                >
                                    <Image
                                        width={70}
                                        height={70}
                                        alt="profile"
                                        src={`${imageUrl}`}
                                        priority
                                        className="rounded-full border-2"
                                    />
                                    <p className="font-medium flex items-start flex-col">
                                        <span>{firstName}</span>
                                        <span>{lastName}</span>
                                    </p>
                                </div>
                            </SheetClose>

                            <ul>
                                {navItems.map((navItem) => (
                                    <li key={navItem.id}>
                                        <Link href={navItem.link}>
                                            <SheetClose
                                                className={cn('flex text-muted-foreground justify-start w-full items-center mt-4 gap-4 p-4 rounded-sm hover:bg-accent duration-200',
                                                    navItem.link === pathName && 'bg-accent text-primary')}
                                            >
                                                {navItem.icon}
                                                <p className='font-medium'>{navItem.title}

                                                </p>
                                            </SheetClose>
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className='flex gap-2 justify-center  p-4 items-center'
                                variant={'ghost'}
                                onClick={() => signOut({ redirectUrl: '/' })}>
                                Sign out
                                <LogOutIcon size={20} />
                            </Button>

                        </div>


                    </SheetContent>

                </Sheet>

                <h1 className='text-xl font-bold p-2 mx-4'>Task Manager</h1>
                <div className='ml-auto'> {/* Pushes the ModeToggle to the right */}
                    <ModeToggle />
                </div>
            </div>
        </nav>
    )
}

export default Sidebar
