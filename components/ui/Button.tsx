import React from 'react'

type Props = {
    children: string | React.ReactNode
    variant?: "btn-primary" | "btn-secondary"
    onClick?: () => void
}

const Button = (props: Props) => {
    return (
        <div onClick={props.onClick} className={`btn ${props.variant ?? "btn-primary"}`}>{props.children}</div>
    )
}

export default Button