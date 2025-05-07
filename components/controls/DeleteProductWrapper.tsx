import React from 'react'

type Props = {
    children: React.ReactNode
}

const DeleteProductWrapper = (props: Props) => {
    return (
        <div className='cursor-pointer select-none'>{props.children}</div>
    )
}

export default DeleteProductWrapper