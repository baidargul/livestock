'use client'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    id?: string
    label?: string
    type?: "text" | "email" | "password" | "number" | "date" | "tel" | "url" | "search"
    placeholder?: string
    disabled?: boolean
    value?: string
    onChange?: (val: string) => void
    className?: string
}

const Textbox = (props: Props) => {
    const txtRef: any = useRef(null)
    const [value, setValue] = useState<string | number>("")

    useEffect(() => {
        if (props.value) {
            setValue(props.value)
        }
    }, [props.value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        if (props.onChange) {
            props.onChange(e.target.value)
        }
    }

    const handleOnFocus = () => {
        if (txtRef.current) {
            txtRef.current.select()
        }
    }

    return (
        <div className='flex flex-col gap-1'>
            {props.label && props.label.length > 0 && <label className='label'>{props.label}</label>}
            <input id={props.id} ref={txtRef} disabled={props.disabled ?? false} type={props.type ?? "text"} placeholder={props.placeholder} className={`textbox w-full focus-within:tracking-wide ${props.className}`} onChange={handleChange} onFocus={handleOnFocus} value={value} />
        </div>
    )
}

export default Textbox