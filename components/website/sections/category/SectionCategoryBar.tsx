'use client'
import { images } from '@/consts/images'
import Image from 'next/image'
import React, { useState } from 'react'

type Props = {
    onChange?: (category: string) => void
}

const SectionCategoryBar = (props: Props) => {
    const [selected, setSelected] = useState("")
    const categories = ["Dogs", "Cats", "Birds", "Fish", "Reptiles", "Incects"]

    const handleSelectCategory = (category: string) => {
        if (String(category).toLocaleLowerCase() === String(selected).toLocaleLowerCase()) {
            setSelected("")
            if (props.onChange) {
                props.onChange("")
            }
        } else {
            setSelected(category.toLocaleLowerCase())
            if (props.onChange) {
                props.onChange(category.toLocaleLowerCase())
            }
        }
    }

    return (
        <div className='w-full flex justify-between gap-2 items-center'>
            {
                categories.map((category, index) => (
                    <div onClick={() => handleSelectCategory(category)} key={index} className={`${selected.toLocaleLowerCase() === category.toLocaleLowerCase() ? "opacity-100" : selected === "" ? "opacity-100" : "opacity-50 blur-[.5px]"} cursor-pointer transition-all duration-300 ease-in-out`}>
                        <Image src={images.hens.covers[1]} alt={category} width={50} height={50} className={`rounded-full object-cover w-12 h-12 ${selected.toLocaleLowerCase() === category.toLocaleLowerCase() && "p-[2px] bg-emerald-500"} `} />
                        <div className='text-center text-sm font-semibold'>{category}</div>
                    </div>
                ))
            }
        </div>
    )
}

export default SectionCategoryBar