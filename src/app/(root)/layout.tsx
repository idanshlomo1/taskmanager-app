import Footer from '@/components/Footer';
import { ModeToggle } from '@/components/ModeToggle';
import Sidebar from '@/components/Sidebar';
import { GlobalContextProvider } from '@/lib/globalContext';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
    title: "Task Manager Application",
    description: "Built using Next.js",
    icons: {
        icon: '/is-logo.svg'
    }
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
    return (
        <GlobalContextProvider>
            <div className='min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20'>
                <div className='flex flex-col md:gap-2 min-h-screen md:p-10 max-w-7xl mx-auto'>
                    <div className='hidden md:block'>
                        <div className='flex w-full justify-between items-center bg-background/80 backdrop-blur-sm px-6 py-4 rounded-lg shadow-sm'>
                            <h1 className='font-bold text-2xl text-primary'>
                                Task Manager
                            </h1>
                            <ModeToggle />
                        </div>
                    </div>
                    <div className='flex md:gap-2 flex-1'>
                        <Sidebar />
                        <div className='w-full'>
                            {children}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </GlobalContextProvider>
    )
}

export default HomeLayout