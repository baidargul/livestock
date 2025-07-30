'use client'
import { actions } from '@/actions/serverActions/actions'
import { images } from '@/consts/images'
import { formalizeText } from '@/lib/utils'
import { EyeClosedIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'

type Props = {
    criteria: string
    setCriteria: (val: string) => void
}

const SearchResults = (props: Props) => {
    const [isFetching, setIsFetching] = useState(false)
    const [results, setResults] = useState<{ products: any[], demands: any[] } | null>(null)


    const fetchCriteria = useCallback(async () => {
        const searchTerm = props.criteria
        if (!searchTerm) {
            setResults(null)
            return
        }

        setIsFetching(true)
        try {
            const response = await actions.client.posts.Query(searchTerm)
            setResults(response.data)
        } catch (error) {
            console.error('Search failed:', error)
            setResults(null)
        } finally {
            setIsFetching(false)
        }
    }, [props.criteria])

    // Debounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchCriteria()
        }, 500) // 0.5 second delay to fetch

        return () => clearTimeout(handler)
    }, [fetchCriteria])

    return (
        <div className='z-10 w-full h-auto max-h-[400px] flex flex-col gap-2 absolute top-12 left-0 p-2 bg-white border border-zinc-300 rounded shadow-2xl'>
            <div className=''>
                <span className='font-semibold'>Search</span> <span>'{props.criteria}'</span>
            </div>
            <div className='w-full h-[90%] overflow-y-auto'>
                {results && results?.products?.length > 0 && <section className=''>
                    <div className='flex flex-col gap-2 w-full'>
                        <h1 className='p-1 w-full border-b border-zinc-300 flex justify-between items-center'>
                            <div>Entities</div> <div>({results.products.length})</div></h1>
                        <div className='grid grid-cols-4 w-full gap-2'>
                            {
                                results.products.map((item, index: number) => {
                                    return (
                                        <Link href={`/entity/${item?.id}`} key={`${index}-${item?.id}`} className='flex flex-col scale-75 origin-top-left'>
                                            <Image src={item.images.length > 0 && item.images[0]?.image ? item.images[0]?.image : images.chickens.images[1]} alt='hen' width={100} height={100} quality={60} loading='lazy' layout='fixed' className='w-full h-14 object-cover object-left-center cursor-pointer' />
                                            <div className='text-sm'>
                                                {item?.title}
                                            </div>
                                            <div className='text-xs'>{item?.city}, {item?.province}</div>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                </section>}
                {results && results?.demands?.length > 0 && <section className=''>
                    <div className='flex flex-col gap-2 w-full'>
                        <h1 className='p-1 w-full border-b border-zinc-300 flex justify-between items-center'>
                            <div>Demands </div> <div>({results.demands.length})</div></h1>
                        <div className='grid grid-cols-4 w-full gap-2'>
                            {
                                results.demands.map((item, index: number) => {
                                    const image = images[item.type.toLowerCase()]?.images[1]
                                    return (
                                        <Link href={`/demands/${item?.id}/`} key={`${index}-${item?.id}`} className='flex flex-col scale-75 origin-top-left'>
                                            <Image src={image} alt='hen' width={100} height={100} quality={60} loading='lazy' layout='fixed' className='w-full h-14 object-cover object-left-center cursor-pointer' />
                                            <div className='text-sm'>
                                                {formalizeText(item?.breed)} {item?.type}
                                            </div>
                                            <div className='text-xs'>{item?.city}, {item?.province}</div>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                </section>}
            </div>
            <div onClick={() => props.setCriteria('')} className='flex gap-1 justify-center text-center items-center border-t border-dashed p-2 -mb-1 border-zinc-300 hover:bg-zinc-100 cursor-pointer'><XIcon /> Close</div>
        </div>
    )
}

export default SearchResults