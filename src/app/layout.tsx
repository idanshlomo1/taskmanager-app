import type { Metadata } from "next";
import { Montserrat as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils"
import { ThemeProvider } from "next-themes";
import { GlobalContextProvider } from "@/lib/globalContext";
import { Toaster } from "react-hot-toast";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import NextTopLoader from 'nextjs-toploader';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Task manger Application",
  description: "Built using Next js",
  icons: {
    icon: '/is-logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            " font-sans antialiased  bg-gradient-to-tl ",
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <GlobalContextProvider>
              {children}
              <Toaster
                position="top-center"
                reverseOrder={false}
              />
              <NextTopLoader
                height={2}
                showSpinner={false}
                easing="cubic-bezier(0.53,0.21,0,1)"
              />
              
            </GlobalContextProvider>

          </ThemeProvider>

        </body>
      </html>
    </ClerkProvider>
  );
}
