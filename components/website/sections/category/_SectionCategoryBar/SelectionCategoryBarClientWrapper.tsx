'use client'
import React, { useState } from 'react'

type Props = {
    onChange?: (category: any) => void
    categories?: any[]
}

const SectionCategoryBarClientWrapper = (props: Props) => {
    const [selected, setSelected] = useState<{ name: string, component: any } | null>(null)

    const handleSelectCategory = (category: any) => {
        if (String(category.name).toLocaleLowerCase() === String(selected).toLocaleLowerCase()) {
            setSelected(null)
            if (props.onChange) {
                props.onChange(null)
            }
        } else {
            setSelected(category)
            if (props.onChange) {
                props.onChange(category)
            }
        }
    }

    return (
        <div className='w-full flex justify-between gap-2 items-center'>
            {
                props.categories && props.categories.map((category, index) => {

                    return (
                        <div onClick={() => handleSelectCategory(category)} key={index} className={`${selected && selected.name.toLocaleLowerCase() === String(category.name).toLocaleLowerCase() ? "opacity-100" : !selected ? "opacity-100" : "opacity-50 blur-[.5px]"} cursor-pointer transition-all duration-300 ease-in-out`}>
                            {category.component}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SectionCategoryBarClientWrapper