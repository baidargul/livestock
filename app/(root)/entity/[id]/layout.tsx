import { SocketProvider } from '@/socket-client/SocketWrapper'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = (props: Props) => {
    return (
        <div>
            {props.children}
        </div>
    )
}

export default layout