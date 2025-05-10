'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
    onChange?: (category: any) => void
    categories?: any[]
    value?: string
}

const SectionCategoryBarClientWrapper = (props: Props) => {
    const [selected, setSelected] = useState<{ name: string, component: any } | null>(null)
    const router = useRouter();
    useEffect(() => {
        if (props.value) {
            setSelected(props.categories?.find((category: any) => String(category.name).toLocaleLowerCase() === String(props.value).toLocaleLowerCase()))
        }
    }, [props.value])

    const handleSelectCategory = (category: any) => {
        if (String(category.name).toLocaleLowerCase() === String(selected?.name).toLocaleLowerCase()) {
            setSelected(null)
            if (props.onChange) {
                props.onChange(null)
            }
            UpdateQueryFilter(null)
        } else {
            setSelected(category)
            if (props.onChange) {
                props.onChange(category)
            }
            UpdateQueryFilter(String(category.name).toLocaleLowerCase())
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