import React from 'react'

type Props = {
    children: string | React.ReactNode
}

const Tag = (props: Props) => {
    return (
        <div className='bg-gradient-to-b from-emerald-50 to-emerald-100 p-2 px-4 w w-fit border border-emerald-100 rounded font-sans tracking-wide text-sm '>{props.children}</div>
    )
}

export default Tag