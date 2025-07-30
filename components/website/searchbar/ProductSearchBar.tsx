'use client'
import Textbox from '@/components/ui/Textbox'
import { Search, SlidersHorizontalIcon } from 'lucide-react'
import React, { useState } from 'react'
import SearchResults from './_components/SearchResults'

type Props = {}

const ProductSearchBar = (props: Props) => {
    const [searchCriteria, setSearchCriteria] = useState('')

    const handleTextChange = (val: string) => {
        setSearchCriteria(val)
    }

    return (
        <div className='flex w-full gap-2 items-center px-4 mb-4'>
            <div className='w-full mt-2 relative'>
                <Textbox onChange={handleTextChange} value={searchCriteria} placeholder='Search for anything' icon={<Search size={20} className='text-zinc-400' />} iconClassName='pl-10' />
                {searchCriteria && searchCriteria.length > 0 && < SearchResults criteria={searchCriteria} setCriteria={setSearchCriteria} />}
            </div>
        </div>
    )
}

export default ProductSearchBar