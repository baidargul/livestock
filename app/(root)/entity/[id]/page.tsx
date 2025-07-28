import { actions } from '@/actions/serverActions/actions'
import BackNavigator from '@/components/controls/BackNavigator'
import DeleteProductWrapper from '@/components/controls/DeleteProductWrapper'
import MediaViewer from '@/components/controls/MediaViewer'
import Button from '@/components/ui/Button'
import { formalizeText, } from '@/lib/utils'
import { ArrowLeftCircleIcon, CandlestickChartIcon, MenuIcon, SquareUserIcon, Trash2Icon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import prisma from '@/lib/prisma'
import CalculatedDescription from '@/components/Animals/CalculatedDescription'
import Link from 'next/link'
import RatingBar from '@/components/website/ratings/RatingBar'
import { images } from '@/consts/images'
import PhoneFooter from '@/components/website/footer/Phone'
import BidProtection from './_components/BidProtection'
import BidTradeView from '@/components/Animals/BidTradeView'
import GeneralFooter from '@/components/website/footer/GeneralFooter'
import ProductGallery from '@/components/ui/ProductGallery'
import ProductMenu from './_components/ProductMenu'
import Marquee from 'react-fast-marquee'
import CTOButton from '@/components/controls/Bidding/_components/CTOButton'
import DirectCTOButton from './_components/DirectCTOButton'

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ id: string }>
}

export async function generateStaticParams() {
    const ids = await prisma.animal.findMany({ select: { id: true } })
    return ids.map(({ id }) => ({ id }))
}

const page = async (props: Props) => {
    const timestamp = Date.now(); // Unique key
    const { params } = props
    const { id } = await params
    const response = await actions.server.post.list(id, 'id');
    const animal = response.data as any
    const breedObj = images[animal.type].breeds.find((b: any) => b.name.toLowerCase() === animal.breed);
    const info = breedObj?.info;
    return (
        animal && <div className='w-full h-full' key={timestamp}>
            <section className='relative w-full min-h-[100vh] hidden md:block'>
                <div className='p-4 flex gap-2 items-start'>
                    <div>
                        <ProductGallery images={animal.images} />
                        <div className=''>
                            <h1 className='text-lg text-start font-bold text-gray-800 mt-4'>{formalizeText(animal?.breed ?? "")} {formalizeText(animal?.type ?? "")}</h1>
                            <div className='max-w-[620px]'>
                                <p className='text-sm text-gray-600'>{info ?? ''}</p>
                            </div>
                        </div>
                    </div>
                    <section>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-2xl font-bold text-gray-800'>{animal.title}</h2>
                            <Link href={`/user/profile/${animal?.user.id}`} className='flex items-center gap-2'>
                                <Image src={animal?.user.profileImage && animal?.user.profileImage.length > 0 ? animal?.user.profileImage[0].image : images.site.placeholders.userProfile} alt={`${animal?.user.name} profile image`} width={32} height={32} className='w-8 h-8 object-cover rounded-full' />
                                <div>
                                    <label className='cursor-pointer select-none text-right tracking-widest w-fit'>{formalizeText(animal?.user.name)}</label>
                                    <div className='scale-75 origin-top-left'>
                                        <RatingBar defaultRating={4.5} readonly />
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <p className='text-lg text-gray-600'>{animal.description}</p>
                        <CalculatedDescription animal={animal} />
                        <div className='flex justify-start items-start gap-4 my-4 w-full'>{
                            animal.deliveryOptions.map((option: any, index: number) => {
                                const Icon = String(option).toLocaleLowerCase() === "self_pickup" ? SquareUserIcon : TruckIcon
                                return (
                                    <div key={`${option}-${index}`} className='flex gap-1 items-center'><Icon size={20} className='text-emerald-700' /> {String(option).toLocaleLowerCase() === "self_pickup" ? "Self Pickup" : "Cargo delivery"}</div>
                                )
                            })
                        }</div>
                    </section>
                </div>
                <GeneralFooter />
            </section>
            <section className='relative w-full min-h-[100vh] md:hidden' data-value="Phone">
                <BackNavigator className='absolute top-3 left-3 z-10 bg-black/20 rounded-full p-1'>
                    <ArrowLeftCircleIcon width={32} height={32} className='text-white' />
                </BackNavigator>
                <div className='absolute top-3 right-3 z-10'>
                    <ProductMenu animal={animal} >
                        <MenuIcon size={32} className='text-black p-1 rounded bg-white' />
                    </ProductMenu>
                </div>
                <div className='relative'>
                    <Image
                        src={animal.images.length > 0 ? animal.images[0].image ? animal.images[0].image : images.chickens.images[1] : images.chickens.images[1]}
                        draggable={false}
                        priority
                        layout="fixed"
                        quality={50}
                        alt="hen"
                        width={100}
                        height={100}
                        style={{ height: "250px" }}
                        className="w-full h-[250px] z-0 select-none origin-top-left object-left-top object-cover"
                    />

                    <div className='bg-emerald-50 p-4 rounded-lg mx-4 absolute -mt-20 z-[1]' style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                        <h1 className='text-3xl text-center font-bold text-gray-800 mt-4'>{formalizeText(animal?.breed ?? "")} {formalizeText(animal?.type ?? "")}</h1>
                        <div className='px-4 py-2'>
                            <p className='text-sm text-gray-600'>{info ?? ''}</p>
                        </div>
                    </div>
                </div>
                <div className='mt-40 p-4'>
                    {animal.allowBidding && <Marquee className='mb-4 border-y-2 pointer-events-none border-amber-500 bg-amber-50 w-full'>
                        <div className='font-semibold p-1 tracking-widest italic text-amber-700 scale-75 -mb-2 origin-top-left'>Bidding Active</div>
                    </Marquee>}
                    {animal?.user.name && <div className='w-full mb-2 flex justify-end items-center'>
                        <Link href={`/user/profile/${animal?.user.id}`} className='flex items-center gap-2'>
                            <Image src={animal?.user.profileImage && animal?.user.profileImage.length > 0 ? animal?.user.profileImage[0].image : images.site.placeholders.userProfile} alt={`${animal?.user.name} profile image`} width={32} height={32} className='w-8 h-8 object-cover rounded-full' />
                            <div>
                                <label className='cursor-pointer select-none text-right tracking-widest w-fit'>{formalizeText(animal?.user.name)}</label>
                                <div className='scale-75 origin-top-left'>
                                    <RatingBar defaultRating={4.5} readonly />
                                </div>
                            </div>
                        </Link>
                    </div>}
                    <h2 className='text-2xl font-bold text-gray-800'>{animal.title}</h2>
                    <p className='text-lg text-gray-600'>{animal.description}</p>
                    <CalculatedDescription animal={animal} />
                    {/* <BidTradeView animalId={animal.id} /> */}
                </div>
                <div className='px-4 flex flex-col gap-4'>
                    <div className='flex flex-wrap justify-start items-start gap-2'>
                        {animal.images.map((item: any, index: number) => {
                            return (
                                <MediaViewer key={`${item.name}-${index}`} image={item.image}>
                                    <Image src={item.image ? item.image : images.chickens.images[1]} alt='hen' width={100} height={100} quality={60} loading='lazy' layout='fixed' className='w-24 h-14 object-cover object-left-center rounded-xl cursor-pointer' />
                                </MediaViewer>
                            )
                        })}
                    </div>
                    <div className='flex justify-evenly items-center my-4 w-full'>{
                        animal.deliveryOptions.map((option: any, index: number) => {
                            const Icon = String(option).toLocaleLowerCase() === "self_pickup" ? SquareUserIcon : TruckIcon
                            return (
                                <div key={`${option}-${index}`} className='flex gap-1 items-center'><Icon size={20} className='text-emerald-700' /> {String(option).toLocaleLowerCase() === "self_pickup" ? "Self Pickup" : "Cargo delivery"}</div>
                            )
                        })
                    }</div>
                </div>
                <div className='px-4 my-2 flex flex-col gap-1 justify-end items-end'>
                    {/* <div className='select-none p-1 bg-green-100 rounded-md scale-75 origin-top-right border border-green-300 w-fit font-bold tracking-wider text-green-800'>
                    {animal.priceUnit && <span className='text-base uppercase '>{`${animal.priceUnit === "per Set" ? "Whole set" : animal.priceUnit}`}</span>}
                </div> */}
                </div>
                <div className='mb-2 px-4 flex justify-center items-center w-full'>
                    {animal.allowBidding &&
                        <BidProtection animal={animal}>
                            <Button className='w-full flex gap-2 items-center justify-center'> <CandlestickChartIcon size={20} /> Buy Now</Button>
                        </BidProtection>
                    }
                    {
                        !animal.allowBidding &&
                        <DirectCTOButton animal={animal}>
                            <Button className='w-full'>
                                Buy Now
                            </Button>
                        </DirectCTOButton>
                    }
                </div>
                <GeneralFooter />
            </section >
        </div>
    )
}

export default page