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
}

const Textbox = (props: Props) => {
    const txtRef: any = useRef(null)

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
            <input id={props.id} ref={txtRef} disabled={props.disabled ?? false} type={props.type ?? "text"} placeholder={props.placeholder} className={`textbox w-full focus-within:tracking-wide ${props.className}`} onChange={handleChange} onKeyDown={handleKeyDown} onFocus={handleOnFocus} value={props.value ?? ""} />
        </div>
    )
}

export default Textbox