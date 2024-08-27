import type { Metadata } from "next";
import { Montserrat as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils"
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { GlobalContextProvider } from "@/lib/globalContext";


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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          " font-sans antialiased ",
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
            <div className="h-[100vh]">
              {children}
            </div>
            {/* <Footer /> */}
          </GlobalContextProvider>

        </ThemeProvider>


      </body>
    </html>
  );
}
