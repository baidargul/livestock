'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
    onChange?: (category: any) => void
    categories?: any[]
    value?: string
}

const SectionCategoryBarClientWrapper = (props: Props) => {
    const [selected, setSelected] = useState<{ name: any, component: any } | null>(null)
    const router = useRouter();
    useEffect(() => {
        if (props.value) {
            const category = (props.categories?.find((category: any) => String(category.name.name).toLocaleLowerCase() === String(props.value).toLocaleLowerCase()))
            if (category) {
                setSelected(category)
            }
        }
    }, [props.value])

    const handleSelectCategory = (category: any) => {
        if (category.name.name.toLocaleLowerCase() === selected?.name.name.toLocaleLowerCase()) {
            setSelected(null)
            UpdateQueryFilter(null)
            if (props.onChange) {
                props.onChange(null)
            }
        } else {
            setSelected(category)
            UpdateQueryFilter(String(category.name.name).toLocaleLowerCase())
            if (props.onChange) {
                props.onChange(category.name.name)
            }
        }
    }

    const UpdateQueryFilter = (value: string | null) => {
        const params = new URLSearchParams(window.location.search);

        if (value) {
            params.set("category", value);
        } else {
            params.delete("category");
        }

        // FOR Update URL without page reload
        // router.push(`?${params.toString()}`, { scroll: false });

        // Force full page reload
        window.location.href = `?${params.toString()}`;
    };

    return (
        <div className='w-full flex justify-between gap-2 pb-4 items-center overflow-x-auto'>
            {
                props.categories && props.categories.map((category, index) => {

                    return (
                        <div onClick={() => handleSelectCategory(category)} key={index} className={`${selected && selected.name.name.toLocaleLowerCase() === category.name.name.toLocaleLowerCase() ? "opacity-100" : !selected ? "opacity-100" : "opacity-50 blur-[.5px]"} cursor-pointer transition-all duration-300 ease-in-out`}>
                            {category.component}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SectionCategoryBarClientWrapper