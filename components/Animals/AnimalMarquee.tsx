'use client'
import { actions } from '@/actions/serverActions/actions'
import { images } from '@/consts/images'
import { calculatePricing, formalizeText, formatCurrency } from '@/lib/utils'
import { CatIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'

type Props = {
    title?: string
    reversedIcon?: boolean
}

const AnimalMarquee = (props: Props) => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetchposts()
        const interval = setInterval(() => {
            fetchposts()
        }, 600000);

        return () => clearInterval(interval);
    }, [])

    const fetchposts = async () => {
        const response = await actions.client.posts.fetchPosts(10)
        if (response.status === 200) {
            setPosts(response.data)
        } else {
            setPosts([])
        }
    }

    return (
        posts.length > 0 &&
        <div className='w-full my-2'>
            <div className={`mb-2 font-semibold tracking-tight flex ${props.reversedIcon && "flex-row-reverse"} gap-1 items-center`}>
                {props.title && props.title.length > 0 ? props.title : "Animals"}
                <CatIcon size={16} className='mt-1' />
            </div>
            <Marquee pauseOnHover={true} className='py-1' >
                {
                    posts.map((animal: any, index: number) => {
                        return (
                            <Link href={`/entity/${animal.id}`} key={`${animal.id}-${index}`} className='grid grid-cols-[auto_1fr] place-items-center gap-2 w-full p-2 bg-white rounded shadow-sm'>
                                <Image src={animal.images.length > 0 ? animal.images[0].image ? animal.images[0].image : images.chickens.images[1] : images.chickens.images[1]} alt={`${animal.title}, ${animal.type} - ${animal.breed}`} width={100} height={100} layout='fixed' className='w-[100px] h-[100px] object-cover bg-black' />
                                <div className='text-xs'>
                                    <div className='font-bold line-clamp-2'>{formalizeText(animal.title)}</div>
                                    <div className='text-zinc-700 italic line-clamp-2'>{formalizeText(animal.description)}</div>
                                    <div className='text-zinc-500'>{formalizeText(animal.breed)} {animal.type}</div>
                                    <div className='text-emerald-700 text-sm font-bold'>{formatCurrency(calculatePricing(animal).price)}</div>
                                </div>
                            </Link>
                        )
                    })
                }
            </Marquee>
        </div>
    )
}

export default AnimalMarquee