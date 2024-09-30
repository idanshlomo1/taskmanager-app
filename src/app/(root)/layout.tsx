import { GlobalContextProvider } from '@/lib/globalContext'
import { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import { ModeToggle } from '@/components/ModeToggle'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
    title: "Task Manager Application",
    description: "Manage your tasks efficiently",
    icons: {
        icon: "/is-logo.svg",
    },
}

const RootLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <GlobalContextProvider>
            <div className="animated-gradient min-h-screen">
                <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className='hidden md:block'>
                            <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm border-b">
                                <h1 className="text-2xl font-bold text-center">Task Manager</h1>
                                <div className="flex items-center space-x-4">
                                    <ModeToggle />
                                </div>
                            </header>
                        </div>
                        <main className="flex-1 overflow-auto py-24 md:py-6 p-6">
                            {children}
                        </main>
                    </div>
                </div>
                <Toaster />
            </div>
        </GlobalContextProvider>
    )
}

export default RootLayout