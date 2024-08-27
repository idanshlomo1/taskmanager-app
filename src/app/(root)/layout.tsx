

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
        <div className='flex gap-10 h-[100vh] p-4'>
            <Sidebar />
            {children}
        </div>
    )
}

export default HomeLayout
