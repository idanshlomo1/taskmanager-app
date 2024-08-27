import Image from 'next/image'
import React from 'react'

const Footer = () => {
    return (
        <div>
            <footer className="flex justify-center pb-6">
                <p className="text-sm flex items-center font-medium gap-1">
                    Made by
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
                   
                        Idan Shlomo
                    </a>
                </p>
            </footer>
        </div>
    )
}

export default Footer
