import React from 'react'

type Props = {
    children: React.ReactNode
    name?: string
}

const Groupbox = (props: Props) => {
    return (
        <div className='relative w-full rounded-md p-2 border border-emerald-700 mt-4 pt-6 flex justify-center items-center'>
            {props.name && <label className='absolute -top-3 tracking-tight left-2 bg-emerald-100 rounded px-2 pb-1 z-10 border border-emerald-700'>{props.name}</label>}
            {props.children}
        </div>
    )
}

export default Groupbox