import React from 'react'

type Props = {
    children: string | React.ReactNode
    variant?: "btn-primary" | "btn-secondary"
}

const Button = (props: Props) => {
    return (
        <div className={`btn ${props.variant ?? "btn-primary"}`}>{props.children}</div>
    )
}

export default Button