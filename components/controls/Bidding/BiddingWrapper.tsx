'use client'
import { actions } from '@/actions/serverActions/actions'
import CalculatedDescription from '@/components/Animals/CalculatedDescription'
import Tag from '@/components/general/Tags/Tag'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { images } from '@/consts/images'
import { useSession } from '@/hooks/useSession'
import { calculatePricing, convertCurrencyToWords, formalizeText, formatCurrency } from '@/lib/utils'
import { useSocket } from '@/socket-client/SocketWrapper'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    children: React.ReactNode
    animal: any
}

const BiddingWrapper = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [offerValue, setOfferValue] = useState(0)
    const [user, setUser] = useState<any>(null);
    const [bids, setBids] = useState<any[]>([])
    const getUser = useSession((state: any) => state.getUser)
    const scrollHookRef = useRef<HTMLDivElement | null>(null);
    const [socketState, setSocketState] = useState({
        isSellerConnected: false,
    })
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const router = useRouter()
    const socket = user ? useSocket() : null; // Use the socket only if user is available

    useEffect(() => {
        if (socket && user) {
            setIsSocketConnected(true);
            socket.on("join-bidroom", ({ room, userId }) => {
                if (room === props.animal.id) {
                    socket.emit("join-bidroom", { room, userId });
                    console.info(`💻 User ${userId} joined bidroom: ${room}`);
                }
            });
            socket.on("user-joined-bidroom", (room) => {
                console.info(`💻 User joined bidroom: ${room.key}`);
                if (room.authorId === user.id) {
                    console.log(`Buyer connected ${room.key}`)
                } else if (room.userId === user.id) {
                    console.log(`You've connected to the bidding room ${room.key}`)
                }
            });
        }

        return () => {
            if (socket) {
                socket.off("join-bidroom");
                socket.off("user-joined-bidroom");
            }
        }
    }, [socket])

    useEffect(() => {
        if (scrollHookRef.current) {
            scrollHookRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        if (bids.length > 0) {
            if (socket && user) {
                socket.emit("join-bidroom", { room: props.animal.id, userId: user?.id });
            }
        }
    }, [bids])

    useEffect(() => {
        const rawUser = getUser();
        setUser(rawUser);
        setOfferValue(calculatePricing(props.animal).price)
        fetchPastBids();
    }, []);

    useEffect(() => {
        setOfferValue(calculatePricing(props.animal).price)
    }, [props.animal])

    const fetchPastBids = async () => {
        const response = await actions.client.posts.listBids(props.animal.id)
        if (response.status === 200) {
            setBids(response.data)
            setOfferValue(response.data[response.data.length - 1]?.price)
        }
    }

    const handleOpen = (val: boolean) => {
        setIsOpen(val)
    }

    const handleOfferChange = (val: string) => {
        const offer = Number(val)
        setOfferValue(offer)
    }

    const handlePostOffer = async () => {
        if (!user) {
            alert("Please sign in to place a bid")
            router.push("/signin")
            return
        }

        if (socket && user) {
            const room = {
                animalId: props.animal.id,
                userId: user.id,
                authorId: props.animal.userId,
                key: `${props.animal.id}-${props.animal.userId}-${user.id}`,
            }
            socket.emit("join-bidroom", room);
            console.info(`💻 User ${user.id} joined bidroom: ${room.key}`);
        }

        // const response = await actions.client.posts.placeBid(user.id, props.animal.id, offerValue)
        // if (response.status === 200) {
        //     setOfferValue(0)
        //     setBids(response.data)
        // }
    }

    if (!isSocketConnected) {
        return <div>Connecting to bidding service...</div>;
    }

    return (
        <>
            <div className={`fixed bottom-0 select-none flex flex-col justify-between gap-0 ${isOpen === true ? "translate-y-0 pointer-events-auto opacity-100" : "translate-y-full pointer-events-none opacity-0"} transition-all duration-300 drop-shadow-2xl border border-emerald-900/30 w-[96%] mx-2 h-[90%] left-0 rounded-t-xl bg-white z-20 p-4`}>
                {bids.length === 0 && <div className='flex flex-col gap-2 overflow-y-auto h-[80%]'>
                    <div>
                        <div className='text-xl font-semibold'>
                            {props.animal.title}
                        </div>
                        <div>
                            {props.animal.description}
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {
                            props.animal.images && props.animal.images.length > 0 && props.animal.images.map((image: any, index: number) => {
                                return (
                                    <Image src={image.image} width={100} height={100} layout='fixed' priority key={index} className=' rounded-md object-contain border border-emerald-800/10 drop-shadow-[2px]' alt={`${props.animal.title}, ${props.animal.type} - ${props.animal.breed}`} />
                                )
                            })
                        }
                    </div>
                    <div>
                        <CalculatedDescription animal={props.animal} />
                    </div>
                </div>}
                {bids.length > 0 && <div className='flex flex-col gap-2 h-full overflow-y-auto'>
                    <div className='text-xl font-semibold flex justify-between items-center my-4 mt-2'>
                        <div>{socketState.isSellerConnected ? "🟢" : "🟠"} Bargain window</div>
                        <div className='text-sm tracking-wide'>
                            <div>
                                <span className='p-1 px-2 bg-amber-100 rounded-md'>{formatCurrency(bids[bids.length - 1]?.price)}</span> / {formatCurrency(calculatePricing(props.animal).price)}
                            </div>
                        </div>
                    </div>
                    <div className='overflow-y-auto h-[80%] pb-32 pr-2'>

                        {
                            bids.length > 0 && <div className='flex flex-col gap-2'>
                                {bids.map((bid: any, index: number) => {
                                    const image = bid.user.profileImage && bid.user.profileImage.length > 0 ? bid.user.profileImage[0].image : images.site.placeholders.userProfile;
                                    return (
                                        <div key={index} className={`flex items-center justify-between text-sm overflow-hidden ${index <= bids.length - 2 ? "opacity-60 grayscale" : "p-1 "} border-b border-gray-200`}>
                                            <div className='flex items-center gap-2'>
                                                <Image src={image} width={50} height={50} className='w-6 h-6 rounded-full object-cover border border-emerald-800/10 drop-shadow-[2px]' alt={`${bid.user.name}'s profile picture`} />
                                                <div>
                                                    <div className={` ${index === bids.length - 1 ? "text-lg" : "text-sm"} `}>{bid.user.id === props.animal.userId ? bid.user.name : "You"}</div>
                                                    <p className='tracking-tight text-xs scale-75 origin-top-left'>{new Date(bid.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true })}</p>
                                                </div>
                                            </div>
                                            <div className={`${index === bids.length - 1 && "font-bold text-lg  bg-emerald-50 px-2 rounded border border-emerald-100 -mr-1"}`}>{formatCurrency(bid.price)}</div>
                                        </div>
                                    )
                                })}
                                <div ref={scrollHookRef} id={`scrollhook`}></div>
                            </div>
                        }
                    </div>
                </div>}
                <div className='w-full fixed bottom-2 left-0 bg-white p-1 px-4 gap-2'>
                    <div className='my-4'>
                        <Textbox label='Give Your Price' type='number' onChange={handleOfferChange} value={offerValue} className='text-center tracking-widest' />
                        <div className='italic text-sm tracking-wide mt-2 text-black/50'>{formalizeText(convertCurrencyToWords(offerValue))}</div>
                    </div>
                    <div className=' flex items-center gap-2'>
                        <Button onClick={() => handleOpen(false)} className='w-full' variant='btn-secondary'>Cancel</Button>
                        <Button onClick={handlePostOffer} disabled={offerValue === 0} className='w-full'>Place Offer</Button>
                    </div>
                </div>
            </div >
            <div onClick={() => handleOpen(true)} className='w-full'>
                {props.children}
            </div>
            <div onClick={() => handleOpen(false)} className={`fixed ${isOpen === true ? "pointer-events-auto opacity-100 backdrop-blur-[1px]" : "pointer-events-none opacity-0"} top-0 left-0 inset-0 w-full h-full bg-black/50 z-10`}></div>
        </>
    )
}

export default BiddingWrapper