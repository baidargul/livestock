import React from 'react'

type Props = {
    options: string[]
    onChange: (value: string) => void
    value: string
    label?: string
}

const Radiogroup = (props: Props) => {

    const handleChange = (value: string) => {
        props.onChange(String(value).toLocaleLowerCase())
    }

    return (
        <div className='flex flex-col gap-2 w-full'>
            {props.label && props.label.length > 0 && <label className='label'>{props.label}</label>}
            <div className='flex flex-wrap gap-4 w-full'>
                {

                    props.options.map((option, index) => (
                        <button key={index} onClick={() => { handleChange(option) }} className={`p-2 px-10 text-center rounded border-2 border-emerald-700 cursor-pointer ${String(props.value).toLocaleLowerCase() === String(option).toLocaleLowerCase() ? 'bg-emerald-700 text-white' : 'bg-white text-black'}`}>
                            {option}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default Radiogroup