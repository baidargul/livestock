'use client'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    id?: string
    label?: string
    type?: "text" | "email" | "password" | "number" | "date" | "tel" | "url" | "search"
    placeholder?: string
    disabled?: boolean
    value?: string | number
    onChange?: (val: string) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    className?: string
    labelClassName?: string
    icon?: React.ReactNode
    iconClassName?: string
    iconHideOnFocus?: boolean
}

const Textbox = (props: Props) => {
    const txtRef: any = useRef(null)
    const [isInFocus, setIsInFocus] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) {
            props.onChange(e.target.value)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (props.onKeyDown) {
            props.onKeyDown(e)
        }

        if (e.key === "Enter") {
            if (txtRef.current) {
                txtRef.current.select()
            }
        } else if (e.key === "Escape") {
            if (txtRef.current) {
                handleChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)
            }
        }
    }

    const handleOnFocus = () => {
        if (txtRef.current) {
            txtRef.current.select()
        }
    }

    return (
        <div className='flex flex-col gap-1'>
            {props.label && props.label.length > 0 && <label className={`label ${props.labelClassName}`}>{props.label}</label>}
            <div className='flex gap-1 items-center relative'>
                {props.icon && <div className={`absolute transition duration-300 left-2 ${isInFocus ? "opacity-0" : "opacity-100"}`}>{props.icon}</div>}
                <input id={props.id} ref={txtRef} disabled={props.disabled ?? false} type={props.type ?? "text"} placeholder={props.placeholder} onFocusCapture={() => setIsInFocus(true)} onBlurCapture={() => setIsInFocus(false)} className={`textbox w-full focus-within:tracking-wide ${props.className} ${props.icon ? `${isInFocus ? "pl-2" : props.iconClassName}` : null}`} onChange={handleChange} onKeyDown={handleKeyDown} onFocus={handleOnFocus} value={props.value ?? ""} />
            </div>
        </div>
    )
}

export default Textbox