import { actions } from '@/actions/serverActions/actions'
import SectionCategoryBar from '@/components/website/sections/category/SectionCategoryBar'
import SectionLandingPageImage from '@/components/website/sections/landingpage/LandingPageImage'
import SectionProductListRow from '@/components/website/sections/product/list/SectionProductListRow'
import React from 'react'

type Props = {}

const page = async (props: Props) => {

    const animals = await actions.server.post.listAll();

    return (
        <div className='px-4 flex flex-col gap-2 items-start w-full'>
            <SectionLandingPageImage />
            <SectionCategoryBar />
            <div className='py-4 flex flex-col gap-4'>
                {
                    animals.data.map((animal: any) => <SectionProductListRow key={animal.id} animal={animal} />)
                }
                {/* <SectionProductListRow /> */}
                {/* <SectionProductListRow /> */}
                {/* <SectionProductListRow /> */}
                {/* <SectionProductListRow /> */}
            </div>
        </div>
    )
}

export default page