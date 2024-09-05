import Image from 'next/image'
import React from 'react'

const Loader = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="flex flex-col gap-4 w-full items-center justify-center">
                <div className="w-28 h-28 border-8 text-blue-500 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-500 rounded-full">
                    <Image alt="logo" width={100} height={100} priority src="is-logo.svg" />
                </div>
            </div>
        </div>
    )
}

export default Loader
