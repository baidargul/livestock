'use client'
import React from 'react'

type Props = {
    children: React.ReactNode
    className?: string
}

const BackNavigator = (props: Props) => {

    const handleNavigateBack = () => {
        window.history.back()
    }

    return (
        <div className={`${props.className} cursor-pointer`} onClick={handleNavigateBack}>{props.children}</div>
    )
}

export default BackNavigator