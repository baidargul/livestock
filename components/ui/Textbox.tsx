'use client'
import React, { useRef, useState } from 'react'

type Props = {
    label?: string
    type?: "text" | "email" | "password" | "number" | "date" | "tel" | "url" | "search"
    placeholder?: string
}

const Textbox = (props: Props) => {
    const txtRef: any = useRef(null)
    const [value, setValue] = useState<string | number>("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleOnFocus = () => {
        if (txtRef.current) {
            txtRef.current.select()
        }
    }

    return (
        <div className='flex flex-col gap-1'>
            {props.label && props.label.length > 0 && <label className='label'>{props.label}</label>}
            <input ref={txtRef} type={props.type ?? "text"} placeholder={props.placeholder} className={`textbox focus-within:tracking-wide`} onChange={handleChange} onFocus={handleOnFocus} value={value} />
        </div>
    )
}

export default Textbox