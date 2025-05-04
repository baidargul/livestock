import React from 'react'

type Props = {
    children: string | React.ReactNode
    variant?: "btn-primary" | "btn-secondary"
    onClick?: () => void
    disabled?: boolean
    className?: string
}

const Button = (props: Props) => {
    return (
        <button disabled={props.disabled ?? false} onClick={props.onClick} className={`btn ${props.variant ?? "btn-primary disabled:pointer-events-none"} ${props.className}`}>{props.children}</button>
    )
}

export default Button