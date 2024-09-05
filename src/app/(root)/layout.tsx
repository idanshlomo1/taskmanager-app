

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
        <div>
            <div className='flex flex-col md:gap-8 min-h-[100vh] p-4 md:p-10 max-w-7xl mx-auto'>
                <div className='w-full rounded-lg justify-between flex items-center'>
                    <h1 className='text-2xl font-bold'>Task Manager</h1>
                    <ModeToggle />
                </div>
                <div className='flex md:gap-10'>
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
