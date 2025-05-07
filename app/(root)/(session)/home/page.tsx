import { actions } from '@/actions/serverActions/actions'
import SectionCategoryBar from '@/components/website/sections/category/SectionCategoryBar'
import SectionLandingPageImage from '@/components/website/sections/landingpage/LandingPageImage'
import SectionProductListRow from '@/components/website/sections/product/list/SectionProductListRow'
import React from 'react'

type Props = {}

const page = async (props: Props) => {

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
            <SectionCategoryBar />
            <div className='py-4 flex flex-col gap-4'>
                {
                    animals.map((animal: any) => <SectionProductListRow key={animal.id} animal={animal} />)
                }
            </div>
        </div>
    )
}

export default page