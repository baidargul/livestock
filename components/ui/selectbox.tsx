import React from 'react'

type Props = {
    options: string[]
    value: string
    onChange: (val: string) => void
    label?: string
}

const Selectbox = (props: Props) => {

    const handleChange = (val: string) => {
        props.onChange(val)
    }

    return (
        <div className='flex flex-col gap-0 w-full'>
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