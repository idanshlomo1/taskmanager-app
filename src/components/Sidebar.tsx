"use client"
import { cn } from '@/lib/utils'
import { Check, Home, Icon, List, Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'


const Sidebar = () => {

    const navItems = [
        {
            id: 1,
            title: "All Tasks",
            icon: <Home />,
            link: "/"
        },
        {
            id: 2,
            title: "Important",
            icon: <List />,
            link: "/important"
        },
        {
            id: 3,
            title: "Completed",
            icon: <Check />,
            link: "/completed"
        },
        {
            id: 4,
            title: "Do It Now",
            icon: <Pencil />,
            link: "/incomplete"
        },
    ]

    const pathName = usePathname()

    return (
        <nav className='relative border rounded-lg p-4 flex flex-col justify-between'>
            <div className="flex gap-4 items-center justify-center">
                <Image
                    width={70}
                    height={70}
                    alt='profile'
                    src="/avatar1.png"
                    className='rounded-full'
                />

                <p className='font-medium flex flex-col'>
                    <span>
                        Idan
                    </span>
                    <span>
                        Shlomo
                    </span>
                </p>

            </div>
            <ul>
                {navItems.map((navItem) => {
                    return (
                        <li key={navItem.id}>
                            <Link
                                className={cn('flex text-muted-foreground gap-2 p-4 rounded-sm hover:bg-accent duration-200',
                                    navItem.link === pathName && 'bg-accent text-primary')}
                                href={navItem.link}>
                                {navItem.icon}
                                <p>
                                    {navItem.title}
                                </p>
                            </Link>
                        </li>
                    )
                })}
            </ul>
            <Button variant={'ghost'}>
                Sign Out
            </Button>
        </nav>
    )
}

export default Sidebar
