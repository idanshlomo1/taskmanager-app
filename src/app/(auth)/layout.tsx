import { redirect } from "next/navigation";
import Footer from '@/components/Footer';
import React, { ReactNode } from 'react'
import { Metadata } from 'next';
import AuthenticatedWarningClient from "@/components/AuthenticatedWarning";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Task Manager Application - Authentication",
  description: "Authenticate to access your Task Manager",
  icons: {
    icon: "/is-logo.svg",
  },
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { userId } = auth();
  const isSignedIn = !!userId;

  if (isSignedIn) {
    redirect('/account');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedWarningClient isSignedIn={isSignedIn} />
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default AuthLayout