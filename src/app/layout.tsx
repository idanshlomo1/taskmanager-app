import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager Application",
  description: "Organize your tasks efficiently with our Task Manager built using Next.js.",
  icons: {
    icon: "/is-logo.svg",
  },
  openGraph: {
    title: "Task Manager Application",
    description: "Efficiently manage your tasks with the Task Manager app, built using Next.js.",
    url: process.env.NEXT_PUBLIC_URL || "https://taskmanager-app-psi.vercel.app/",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL || "https://taskmanager-app-psi.vercel.app"}/is-logo.svg`,
        width: 1200,
        height: 630,
        alt: "Task Manager Application",
      },
    ],
    siteName: "Task Manager",
  },
  twitter: {
    card: "summary_large_image",
    title: "Task Manager Application",
    description: "Efficient task management with our Task Manager built in Next.js.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL || "https://taskmanager-app-psi.vercel.app"}/is-logo.svg`,
        alt: "Task Manager Application",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(`antialiased ${montserrat.className}`)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" reverseOrder={false} />
            <NextTopLoader
              height={2}
              showSpinner={false}
              easing="cubic-bezier(0.53,0.21,0,1)"
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}