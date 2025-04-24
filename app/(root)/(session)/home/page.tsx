import SectionCategoryBar from '@/components/website/sections/category/SectionCategoryBar'
import SectionLandingPageImage from '@/components/website/sections/landingpage/LandingPageImage'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <div className='px-4 flex flex-col gap-2 items-start w-full'>
            <SectionLandingPageImage />
            <SectionCategoryBar />
        </div>
    )
}

export default page