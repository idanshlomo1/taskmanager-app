import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HomeIcon, SearchIcon } from "lucide-react"
import { ModeToggle } from '@/components/ModeToggle'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold ">404</h1>
          <h2 className="mt-2 text-3xl font-bold ">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sorry, we couldn't find the page you're looking for.</p>
        </div>
        <div className="mt-8 space-y-4">
          <Link href="/" passHref>
            <Button className="w-full flex items-center justify-center">
              <HomeIcon className="w-5 h-5 mr-2" />
              Go back home
            </Button>
          </Link>
          <ModeToggle/>
         
        </div>
      </div>
    </div>
  )
}