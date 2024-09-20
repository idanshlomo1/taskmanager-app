

import Footer from '@/components/Footer';
import { ModeToggle } from '@/components/ModeToggle';
import Sidebar from '@/components/Sidebar';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'


export const metadata: Metadata = {
    title: "Task manager Application",
    description: "Built using Next js",
    icons: {
        icon: '/is-logo.svg'
    }
};
const HomeLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className='bg-gradient-to-br from-primary/20 to-secondary/20'>
            <div className='flex flex-col md:gap-2 min-h-[100vh]  md:p-10 max-w-7xl mx-auto '>
                <div className='hidden md:block '>

                    <div className='flex w-full justify-between items-center bg-background px-6 py-4 rounded-lg'>
                        <h1 className='font-bold text-2xl'>
                            Task Manager
                        </h1>
                        <ModeToggle />
                    </div>
                </div>
                <div className='flex md:gap-2'>
                    <Sidebar />
                    <div className='w-full'>
                        {children}
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    )
}

export default HomeLayout
