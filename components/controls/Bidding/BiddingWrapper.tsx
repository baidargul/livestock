'use client'
import { actions } from '@/actions/serverActions/actions'
import { bidRoom } from '@/actions/serverActions/server/partials/bidroom'
import CalculatedDescription from '@/components/Animals/CalculatedDescription'
import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { images } from '@/consts/images'
import { useSession } from '@/hooks/useSession'
import { calculatePricing, convertCurrencyToWords, formalizeText, formatCurrency } from '@/lib/utils'
import { useSocket } from '@/socket-client/SocketWrapper'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Rooms from './_components/Rooms'

type Props = {
    children: React.ReactNode
    animal: any
}

const BiddingWrapper = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [offerValue, setOfferValue] = useState(0)
    const [user, setUser] = useState<any>(null);
    const getUser = useSession((state: any) => state.getUser)
    const scrollHookRef = useRef<HTMLDivElement | null>(null);
    const [workingForRoom, setWorkingForRoom] = useState(false)
    const [bidRooms, setBidRooms] = useState<any[]>([])
    const [activeBidRoom, setActiveBidRoom] = useState<any>(null)
    const [socketState, setSocketState] = useState({
        isOtherUserConnected: false,
    })
    const router = useRouter()
    const socket = useSocket()
    const isAuthor = user ? props.animal.userId === user.id : false


    useEffect(() => {
        if (socket && user) {
            fetchBidRoomsForThisAnimal()
            socket.on("user-joined-bidroom", ({ room, userId }) => {
                // console.log(room)
                if (userId === user.id) {
                    handleOpen(true);
                    setActiveBidRoom(room)
                }
                if (isAuthor) {
                    if (room.activeUsers.length > 1) {
                        setSocketState({ ...socketState, isOtherUserConnected: true });
                    } else {
                        setSocketState({ ...socketState, isOtherUserConnected: false });
                    }
                } else {
                    setSocketState({ ...socketState, isOtherUserConnected: room.activeUsers.includes(props.animal.userId) });
                }
                // console.info(`💻 User '${userId}' joined bidroom: ${room.key}`);
            });
            socket.on("user-left-bidroom", ({ room, userId }) => {
                if (isAuthor) {
                    if (room) {
                        if (room.activeUsers.length > 1) {
                            setSocketState({ ...socketState, isOtherUserConnected: true });
                        } else {
                            setSocketState({ ...socketState, isOtherUserConnected: false });
                        }
                    } else {
                        setSocketState({ ...socketState, isOtherUserConnected: false });
                    }

                } else {
                    setSocketState({ ...socketState, isOtherUserConnected: room.activeUsers?.includes(props.animal.userId) });
                }
                // console.log(`${userId} left the room`)
            })
            socket.on("bid-placed", ({ bidRoom }) => {
                const newBids = bidRoom.bids.slice(-10);
                // if (activeBidRoom) {
                setActiveBidRoom((prev: any) => { return { ...prev, bids: newBids } })
                // }
            })
        }

        return () => {
            if (socket) {
                socket.off("user-joined-bidroom");
                socket.off("user-left-bidroom")
                socket.off("bid-placed")
            }
        }
    }, [socket])

    useEffect(() => {
        if (scrollHookRef.current) {
            scrollHookRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        if (activeBidRoom && activeBidRoom.bids.length > 0) {
            const lastBid = activeBidRoom.bids[activeBidRoom.bids.length - 1]
            setOfferValue(lastBid.price)
        }

    }, [activeBidRoom])

    useEffect(() => {
        const rawUser = getUser();
        setUser(rawUser);
        if (!activeBidRoom) {
            setOfferValue(calculatePricing(props.animal).price)
        } else {
            setOfferValue(activeBidRoom.bids[activeBidRoom.bids.length - 1].price)
        }
    }, []);

    useEffect(() => {
        setOfferValue(calculatePricing(props.animal).price)
    }, [props.animal])

    const fetchBidRoomsForThisAnimal = async () => {
        if (user && props.animal.userId === user.id) {
            const response = await actions.client.bidRoom.listByUser(user.id, props.animal.id)
            if (response.status === 200) {
                setBidRooms(response.data.myRooms)
            }
        }
    }

    const handleOpen = (val: boolean) => {
        setIsOpen(val)
    }

    const handleOfferChange = (val: string) => {
        const offer = Number(val)
        setOfferValue(offer)
    }

    const handleCreateBidRoom = async () => {
        setWorkingForRoom(true)
        if (props.animal.userId === user.id) {
            handleOpen(true)
        } else {
            if (socket && user) {
                const room = {
                    animalId: props.animal.id,
                    authorId: props.animal.userId,
                    userId: user.id,
                    key: `${props.animal.id}-${props.animal.userId}-${user.id}`,
                }

                socket.emit("join-bidroom", { room, userId: user.id });
            }
        }
        setWorkingForRoom(false)
    }

    const handleCloseBidRoom = async () => {
        if (socket) {
            if (activeBidRoom) {
                const room = {
                    ...activeBidRoom
                }
                socket.emit("close-bidroom", { room });
            }
        }
        handleOpen(false);
    }

    const handleLeaveRoom = async () => {
        setWorkingForRoom(true);
        if (activeBidRoom) {
            if (socket) {
                const room = {
                    animalId: activeBidRoom.animalId,
                    authorId: activeBidRoom.authorId,
                    userId: activeBidRoom.userId,
                    key: activeBidRoom.key,
                };
                socket.emit("leave-bidroom", { room, userId: user.id });
            }
            setActiveBidRoom(null);
        } else {
            handleOpen(false);
        }
        setWorkingForRoom(false);
    }

    const handlePostOffer = async () => {
        if (!user) {
            alert("Please sign in to place a bid")
            router.push("/signin")
            return
        }
        if (offerValue <= 0) return


        if (activeBidRoom) {
            if (socket && user) {
                socket.emit("place-bid", { roomKey: activeBidRoom.key, userId: user.id, amount: offerValue });
                setOfferValue(0)
            }
        }

        // const response = await actions.client.posts.placeBid(user.id, props.animal.id, offerValue)
        // if (response.status === 200) {
        //     setOfferValue(0)
        //     setBids(response.data)
        // }
    }

    const handlePlaceOfferKeyDown = (e: any) => {
        if (e.key === "Enter") {
            handlePostOffer()
        }
    }

    if (!socket) {
        return <div>Connecting to bidding service...</div>;
    }

    return (
        <>
            <div className={`fixed bottom-0 select-none flex flex-col justify-between gap-0 ${isOpen === true ? "translate-y-0 pointer-events-auto opacity-100" : "translate-y-full pointer-events-none opacity-0"} transition-all duration-300 drop-shadow-2xl border border-emerald-900/30 w-[96%] mx-2 h-[90%] left-0 rounded-t-xl bg-white z-20 p-4`}>
                {!activeBidRoom && bidRooms.length === 0 && <div className='flex flex-col gap-2 overflow-y-auto h-[80%]'>
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
                <div className='flex flex-col gap-4'>
                    {activeBidRoom && <div className=''>
                        <div className='text-xl font-semibold flex justify-between items-center mt-1'>
                            <div>{socketState.isOtherUserConnected ? "🟢" : "🟠"} {isAuthor ? activeBidRoom.user.name : activeBidRoom.author.name}</div>
                            <div className='text-sm tracking-wide'>
                                {activeBidRoom.bids.length > 0 && <div>
                                    <span className='p-1 px-2 bg-amber-100 rounded-md'>{formatCurrency(activeBidRoom.bids.length > 0 && activeBidRoom.bids[activeBidRoom.bids.length - 1]?.price)}</span> / {formatCurrency(calculatePricing(props.animal).price)}
                                </div>}
                            </div>
                        </div>
                    </div>}
                    <div className='overflow-y-auto h-full max-h-[400px]'>
                        {!activeBidRoom && <Rooms rooms={bidRooms} socket={socket} currentUser={user} />}
                        {
                            activeBidRoom && activeBidRoom.bids && activeBidRoom.bids.length > 0 && activeBidRoom?.bids?.map((bid: any, index: number) => {
                                return (
                                    <div onClick={() => setOfferValue(bid.price)} key={`${bid.id}-${index}`} className={`p-2  ${user.id === bid.userId ? "bg-gradient-to-r from-emerald-100 to-transparent" : "bg-gradient-to-l from-amber-100 to-transparent"} flex justify-between items-center border-b tracking-tight border-zinc-100 hover:bg-gradient-to-l hover:bg-zinc-100/70 to:bg-transparent cursor-pointer`}>
                                        <div className='tracking-tight'>{user.id === bid.userId ? "You" : bid.user.name}</div> <div className={`tracking-wide ${index === activeBidRoom.bids.length - 1 && "text-emerald-700 font-bold"}`}>{formatCurrency(bid.price)}</div>
                                    </div>
                                )
                            })
                        }
                        <div ref={scrollHookRef}></div>
                    </div>
                </div>
                <div className='w-full fixed bottom-2 left-0 bg-white p-1 px-4 gap-2'>
                    {isAuthor && activeBidRoom && bidRooms.length > 0 && <div className='my-4'>
                        <Textbox onKeyDown={handlePlaceOfferKeyDown} label='Give Your Price' type='number' onChange={handleOfferChange} value={offerValue} className='text-center tracking-widest' />
                        <div className='italic text-sm tracking-wide mt-2 text-black/50'>{formalizeText(convertCurrencyToWords(offerValue))}</div>
                    </div>}
                    {!isAuthor && activeBidRoom && <div className='my-4'>
                        <Textbox onKeyDown={handlePlaceOfferKeyDown} label='Give Your Price' type='number' onChange={handleOfferChange} value={offerValue} className='text-center tracking-widest' />
                        <div className='italic text-sm tracking-wide mt-2 text-black/50'>{formalizeText(convertCurrencyToWords(offerValue))}</div>
                    </div>}
                    <div className=' flex items-center gap-2'>
                        <Button onClick={handleLeaveRoom} className='w-full' variant='btn-secondary'>{!activeBidRoom ? "Close" : "Cancel"}</Button>
                        {activeBidRoom && <Button onClick={handlePostOffer} disabled={offerValue === 0} className='w-full'>Place Offer</Button>}
                    </div>
                </div>
            </div >
            <div onClick={handleCreateBidRoom} className='w-full'>
                {workingForRoom ? <Button disabled className='w-full'>...</Button> : isAuthor ? <Button className='w-full'>{bidRooms.length > 0 ? `(${bidRooms.length} active offer${bidRooms.length > 0 && "s"})` : "No active bids"}</Button> : props.children}
            </div>
            <div onClick={() => handleOpen(false)} className={`fixed ${isOpen === true ? "pointer-events-auto opacity-100 backdrop-blur-[1px]" : "pointer-events-none opacity-0"} top-0 left-0 inset-0 w-full h-full bg-black/50 z-10`}></div>
        </>
    )
}

export default BiddingWrapper