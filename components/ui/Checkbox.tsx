import { CheckCircle2Icon } from 'lucide-react'
import React from 'react'

type Props = {
    label: string
    value: boolean
    onChange: (val: boolean) => void
    disabled?: boolean
}

const Checkbox = (props: Props) => {

    const handleChange = () => {
        if (props.disabled) return
        props.onChange(!props.value)
    }

    return (
        <div onClick={handleChange} className='flex gap-1 group items-center cursor-pointer relative'>
            {props.value === true && <CheckCircle2Icon className='text-white absolute w-4 h-4 left-[2px] top-[5px]' />}
            <div className={`cursor-pointer w-5 h-5 rounded  transition-all duration-200 ease-in-out  ${props.value === true ? "bg-emerald-500" : "bg-zinc-100 group-hover:bg-emerald-100/40 group-hover:border-emerald-200 border border-zinc-200"}`}></div>
            <label className='cursor-pointer label'>{props.label}</label>
        </div>
    )
}

export default Checkbox