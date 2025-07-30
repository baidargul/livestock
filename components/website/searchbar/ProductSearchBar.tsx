import Textbox from '@/components/ui/Textbox'
import { Search, SlidersHorizontalIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const ProductSearchBar = (props: Props) => {
    return (
        <div className='flex w-full gap-2 items-center px-4 mb-4'>
            <div className='w-full mt-2'>
                <Textbox placeholder='Search for a new freind' icon={<Search size={20} className='text-zinc-400' />} iconClassName='pl-10' />
            </div>
            {/* <div className='bg-emerald-100 text-emerald-600 border border-emerald-200 cursor-pointer p-2 rounded'>
                <SlidersHorizontalIcon />
            </div> */}
        </div>
    )
}

export default ProductSearchBar