

import Footer from '@/components/Footer';
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
const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (

        <div className=''>

            {children}

            <Footer />
        </div>

    )
}

export default AuthLayout
