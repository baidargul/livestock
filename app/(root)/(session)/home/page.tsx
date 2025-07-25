import SectionCategoryBar from '@/components/website/sections/category/SectionCategoryBar'
import DemandRowLite from '@/components/website/sections/demands/list/DemandRowLite'
import SectionLandingPageImage from '@/components/website/sections/landingpage/LandingPageImage'
import SectionProductListRow from '@/components/website/sections/product/list/SectionProductListRow'
import React from 'react'

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const page = async (props: Props) => {

    const filters = (await props.searchParams)
    const selectedCategoryFilter = filters.category

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post`, {
        method: 'GET',
        cache: 'no-store',
    });

    const data = await response.json()
    if (data.status !== 200) {
        return (
            <div>
                {data.message}
            </div>
        )
    }

    const animals = data.data

    return (
        <div className='px-4 flex flex-col gap-2 items-start w-full'>
            <SectionLandingPageImage />
            <SectionCategoryBar value={selectedCategoryFilter as string} />
            <div className='py-4 pb-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 w-full gap-2 z-0'>
                {
                    animals.map((animal: any) => {
                        if (selectedCategoryFilter && String(selectedCategoryFilter).length > 0) {
                            if (String(animal.type).toLocaleLowerCase() !== String(selectedCategoryFilter).toLocaleLowerCase()) return
                        }
                        return (<SectionProductListRow key={animal.id} animal={animal} />)
                    })
                }
            </div>
            <DemandRowLite />
        </div>
    )
}

export default page