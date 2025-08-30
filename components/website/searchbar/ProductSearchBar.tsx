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
        <>
            <div className='flex w-full gap-2 items-center px-4 mb-4 sticky z-[4]'>
                <div className='w-full mt-2 relative bg-white'>
                    <Textbox type='text' onChange={handleTextChange} value={searchCriteria} placeholder='Search for anything' icon={<Search size={20} className='text-zinc-400 bg-white' />} iconClassName='pl-10' />
                    {searchCriteria && searchCriteria.length > 0 && < SearchResults criteria={searchCriteria} setCriteria={setSearchCriteria} />}
                </div>
            </div>
            {searchCriteria.length > 0 && <div onClick={() => setSearchCriteria('')} className='inset-0 fixed w-full h-full z-[1] bg-emerald-600/40 backdrop-blur-[1px]'></div>}
        </>
    )
}

export default ProductSearchBar