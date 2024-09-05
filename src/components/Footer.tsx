import Image from 'next/image'
import React from 'react'

const Footer = () => {
    return (
        <div>
            <footer className="flex justify-center py-6">
                <p className=" flex items-center gap-1">
                    <span className='text-xs font-medium text-muted-foreground'>
                        Made by
                    </span>
                    <a
                        className="flex items-center hover:opacity-80 transition duration-200 ease-in-out"
                        href="https://idanshlomo.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            className="mr-1"
                            src="/is-logo.svg"
                            alt="Idan Shlomo Logo"
                            width={25}
                            height={25}
                        />
                        <span className='font-medium text-sm'>
                            Idan Shlomo
                        </span>
                    </a>
                </p>
            </footer>
        </div>
    )
}

export default Footer
