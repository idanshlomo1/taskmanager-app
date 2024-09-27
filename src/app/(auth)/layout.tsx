

import AuthenticatedWarning from '@/components/AuthenticatedWarning';
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
        <div className="min-h-screen flex flex-col">
        <AuthenticatedWarning />
        <main className="flex-grow flex items-center justify-center">
          {children}
        </main>
        <Footer />
      </div>
    )
}

export default AuthLayout
