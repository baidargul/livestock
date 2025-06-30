import React from 'react'
import Client from './_components/Client'

type Props = {}

const page = (props: Props) => {
    return (
        <div className='relative px-4 flex flex-col justify-center items-center w-full select-none min-h-[100dvh]'>
            <Client />
        </div>
    )
}

export default page