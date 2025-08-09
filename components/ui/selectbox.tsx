import React, { useEffect } from 'react'

type Props = {
    options: string[]
    value: string
    onChange: (val: string) => void
    label?: string
    className?: string
    autoSelectSingle?: boolean
}

const Selectbox = (props: Props) => {

    const handleChange = (val: string) => {
        props.onChange(val)
    }

    useEffect(() => {
        if (props.autoSelectSingle) {
            if (props.options.length === 1) {
                handleChange(props.options[0])
            }
        }
    }, [])

    return (
        <div className={`flex flex-col gap-0 w-full transition duration-300 ease-in-out ${props.className}`}>
            {props.label && props.label.length > 0 && <label className='label'>{props.label}</label>}
            <div className='flex items-center gap-2 w-full'>
                {
                    props.options.map((option, index) => (
                        <div key={index} className={`p-2 text-center tracking-tight rounded border border-emerald-700 cursor-pointer ${String(props.value).toLocaleLowerCase() === String(option).toLocaleLowerCase() ? 'bg-emerald-700 text-white' : 'bg-white text-black'}`} onClick={() => handleChange(option)}>
                            <label htmlFor={option} className='cursor-pointer'>{option}</label>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default Selectbox