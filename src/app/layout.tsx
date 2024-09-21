import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; // No 'as', direct import
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";

// Directly use Montserrat without renaming
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat", // Custom variable name
});

export const metadata: Metadata = {
  title: "Task Manager Application",
  description: "Built using Next.js",
  icons: {
    icon: "/is-logo.svg",
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
        <body
          className={cn(
            "antialiased ", // Customize your background gradient
            montserrat.variable // Apply Montserrat specifically
          )}
        >
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
