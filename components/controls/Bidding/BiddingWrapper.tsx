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
import { CheckCheckIcon, ChevronLeftIcon, LockIcon, LockOpenIcon } from 'lucide-react'
import BidRow from './_components/BidRow'
import { useRooms } from '@/hooks/useRooms'
import { Bids } from '@prisma/client'
import { deserialize, serialize } from 'bson'
import { useLoader } from '@/hooks/useLoader'
import GeneralBasicInformation from './_components/GeneralBasicInformation'
import TheActualBidRoom from './_components/TheActualBidRoom'
import { useDialog } from '@/hooks/useDialog'
import CTOButton from './_components/CTOButton'
import CloseDealFinalConfirmation from './_components/CloseDealFinalConfirmation'

type Props = {
    children: React.ReactNode
    animal: any
    staticStyle?: boolean
    allowJoinRoomImmediately?: boolean
    room?: any
    targetRoomKey?: { key: string, refill: () => void, clear: () => void }
}

const BiddingWrapper = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [offerValue, setOfferValue] = useState<string | number>(0)
    const [myLastOffer, setMyLastOffer] = useState<string | number>(0)
    const [user, setUser] = useState<any>(null);
    const getUser = useSession((state: any) => state.getUser)
    const scrollHookRef = useRef<HTMLDivElement | null>(null);
    const [activeBidRoom, setActiveBidRoom] = useState<any>(null)
    const [isLocked, setIsLocked] = useState(false)
    const [hasOtherUserLocked, setHasOtherUserLocked] = useState(false)
    const [tempMessageOnHold, setTempMessageOnHold] = useState<Bids | null>(null)
    const [thisRoomActiveBiders, setThisRoomActiveBidders] = useState(0)
    const [finalBids, setFinalBids] = useState<any[]>([])
    const [selectedBid, setSelectedBid] = useState<any>(null)
    const [socketState, setSocketState] = useState({
        isOtherUserConnected: false,
    })
    const [socket, setSocket] = useState<any>(null)
    const router = useRouter()
    const rawSocket = useSocket()
    const isAuthor = user ? props.animal.userId === user.id : false
    const [expectedKey, setExpectedKey] = useState(``)
    const rooms = useRooms((state: any) => state.rooms)
    const addRoom = useRooms((state: any) => state.addRoom)
    const removeRoom = useRooms((state: any) => state.removeRoom)
    const setLoading = useLoader((state: any) => state.setLoading)
    const [animal, setAnimal] = useState<any>(null)
    const dialog = useDialog()

    useEffect(() => {
        setAnimal(props.animal)
    }, [props.animal])

    if (rawSocket && !socket) {
        setSocket(rawSocket)
    }

    useEffect(() => {
        setFinalBids([])
        setTempMessageOnHold(null)
        setThisRoomActiveBidders(0)
    }, [activeBidRoom])

    useEffect(() => {
        if (socket && animal) {
            socket.on("low-balance", () => {
                setTempMessageOnHold(null)
                setMyLastOffer(0)
                dialog.showDialog("Low Balance", null, `You don't have enough balance to place this bid.`);
            })
            socket.on("sold", (binaryData: any) => {
                const { animalId, room } = deserialize(binaryData);
                if (animalId === animal.id) {
                    setAnimal({ ...animal, sold: true })
                    dialog.showDialog("Sold", null, `The animal has been sold.`);
                    removeRoom(room?.key)
                }
                const route = window.location.pathname
                if (route.includes(`entity/${animalId}`)) {
                    router.refresh()
                }
            })

            return () => {
                if (socket) {
                    socket?.off("low-balance");
                    socket?.off("sold")
                }
            };
        }
    }, [animal, socket])

    useEffect(() => {
        if (isMounted && user) {
            let room: any = null;
            let activeBidders = 0
            rooms.myRooms.find((r: any) => {
                if (r.animalId === animal.id) {
                    activeBidders = activeBidders + 1
                }
                if (r.key === expectedKey) {
                    room = r
                }
            })

            if (!room) {
                rooms.otherRooms.find((r: any) => {
                    if (r.animalId === animal.id) {
                        activeBidders = activeBidders + 1
                    }
                    if (r.key === expectedKey) {
                        room = r
                    }
                })
            }

            setThisRoomActiveBidders(activeBidders)

            if (room && room.key) {
                setActiveBidRoom(room)
                setExpectedKey(room.key)
            } else {
                setActiveBidRoom(null)
                setExpectedKey(`${animal.id}-${animal.userId}-${user.id}`)
            }
        }
        setTempMessageOnHold(null)
    }, [rooms])

    useEffect(() => {
        if (socket && user) {
            fetchBidRoomsForThisAnimal()
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

        if (activeBidRoom) {
            let isThisActiveUser = activeBidRoom.activeUsers.includes(user.id)
            if (isThisActiveUser) {
                handleOpen(true);
            }

            if (isAuthor) {
                if (activeBidRoom.activeUsers.length > 1) {
                    setSocketState({ ...socketState, isOtherUserConnected: true });
                } else {
                    setSocketState({ ...socketState, isOtherUserConnected: false });
                }
            } else {
                setSocketState({ ...socketState, isOtherUserConnected: activeBidRoom.activeUsers.includes(animal.userId) });
            }


            let bids = []
            let thisUserLastBidValue = 0
            for (const bid of activeBidRoom?.bids) {
                if (bid.userId === user.id && bid.isFinalOffer) {
                    bids.push(bid)
                    setIsLocked(true)
                } else if (bid.userId !== user.id && bid.isFinalOffer) {
                    bids.push(bid)
                    setHasOtherUserLocked(true)
                }
                if (bid.userId === user.id) thisUserLastBidValue = bid.price
            }
            if (bids.length > 0) {
                const authorIndex = bids.findIndex((bid: any) => bid.userId === animal.userId);
                if (authorIndex !== -1) {
                    const [authorBid] = bids.splice(authorIndex, 1);
                    bids.unshift(authorBid);
                }
            }

            bids = bids.filter((theBid: any) => typeof theBid === 'object');

            setFinalBids(bids)
            setMyLastOffer(thisUserLastBidValue)
            if (activeBidRoom.closedAt) {
                const bid = activeBidRoom.bids.find((bid: any) => bid.price === activeBidRoom.closedAmount)
                setSelectedBid(bid)
            }
        }

    }, [activeBidRoom])

    useEffect(() => {
        const rawUser = getUser();
        setUser(rawUser);
        setIsMounted(true);
        if (isMounted) {
            if (!activeBidRoom) {
                setOfferValue(calculatePricing(animal).price)
            } else {
                setOfferValue(activeBidRoom.bids[activeBidRoom.bids.length - 1].price)
            }
        }
    }, [isMounted]);



    useEffect(() => {
        setOfferValue(calculatePricing(animal).price)
    }, [animal])


    const fetchBidRoomsForThisAnimal = async () => {
        const response = await actions.client.bidRoom.listByUser(user.id, animal.id)
        if (response.status === 200) {
            for (const theRoom of response.data.myRooms) {
                theRoom.bids = bidsReverse(theRoom.bids)
                addRoom(theRoom, user)
            }
            for (const theRoom of response.data.otherRooms) {
                theRoom.bids = bidsReverse(theRoom.bids)
                addRoom(theRoom, user)
            }
        }
    }
    const handleOpen = (val: boolean) => {
        setIsOpen(val)
        if (val === false) {
            if (props.targetRoomKey) {
                props.targetRoomKey.refill()
            }
        }
    }
    const handleOfferChange = (val: string | number) => {
        const offer = String(val).length > 0 ? Number(val) : val
        setOfferValue(offer)
    }
    const handleCreateBidRoom = async () => {
        if (isAuthor) {
            handleOpen(true)
            if (props.allowJoinRoomImmediately) {
                if (socket && user) {
                    const room = {
                        animalId: props.room.animalId,
                        authorId: props.room.authorId,
                        userId: props.room.userId,
                        key: `${props.room.animalId}-${props.room.authorId}-${props.room.userId}`,
                        offer: calculatePricing(animal.price).price,
                        deliveryOptions: ["SELF_PICKUP"],
                        maleQuantityAvailable: 1,
                        femaleQuantityAvailable: 1
                    }
                    socket.emit("join-bidroom", serialize({ room, userId: user.id }));
                }
            }
        } else {
            if (socket && user) {
                const room = {
                    animalId: animal.id,
                    authorId: animal.userId,
                    userId: user.id,
                    key: `${animal.id}-${animal.userId}-${user.id}`,
                    offer: calculatePricing(animal.price).price,
                    deliveryOptions: ["SELF_PICKUP"],
                    maleQuantityAvailable: 1,
                    femaleQuantityAvailable: 1
                }

                socket.emit("join-bidroom", serialize({ room, userId: user.id }));
            }
        }
    }

    const handleLeaveRoom = async (force?: boolean) => {
        if (activeBidRoom) {
            if (socket) {
                const room = {
                    animalId: activeBidRoom.animalId,
                    authorId: activeBidRoom.authorId,
                    userId: activeBidRoom.userId,
                    key: activeBidRoom.key,
                };
                socket.emit("leave-bidroom", serialize({ room, userId: user.id }));
                setExpectedKey(``);
            }
            setActiveBidRoom(null);
        } else {
            handleOpen(false);
        }
        if (force) {
            handleOpen(false);
            setActiveBidRoom(null);
        }
        if (props.targetRoomKey) {
            if (props.targetRoomKey.key !== '') {
                props.targetRoomKey.clear()
            } else {
                props.targetRoomKey.refill()
            }
        }
    }
    const handlePostOffer = async () => {
        if (!user) {
            alert("Please sign in to place a bid")
            router.push("/signin")
            return
        }
        if (Number(offerValue) <= 0) return


        if (activeBidRoom) {
            if (socket && user) {
                socket.emit("place-bid", serialize({ roomKey: activeBidRoom.key, userId: user.id, amount: offerValue }));
                setMyLastOffer(offerValue)
                setTempMessageOnHold({ id: `${activeBidRoom.id}-${user.id}`, bidRoomId: activeBidRoom.id, userId: user.id, price: Number(offerValue), createdAt: new Date(), isSeen: false, isFinalOffer: false, intial: false })
                setOfferValue(0)
            }
        }
    }
    const handlePlaceOfferKeyDown = (e: any) => {
        if (e.key === "Enter") {
            handlePostOffer()
        }
    }
    const handleLockThisAsMyFinalOffer = async () => {

        if (activeBidRoom) {
            if (socket && user) {
                setLoading(true)
                socket.emit("lock-bid-as-final-offer", serialize({ roomId: activeBidRoom.id, userId: user.id }));
            }
        }
    }

    if (!socket) {
        return <div>Connecting to bidding service...</div>;
    }

    const handleCloseDeal = (bid: any) => {
        if (activeBidRoom) {
            if (socket && user) {
                //only author can close the deal
                if (isAuthor) {
                    dialog.showDialog("Close Deal", <CloseDealFinalConfirmation socket={socket} bid={bid} user={user} activeRoom={activeBidRoom} />)

                }
            }
        }
    }

    return (
        animal && <>
            <div className={`fixed ${props.staticStyle ? 'bottom-0 h-[95%]' : 'bottom-0 h-[80%]'}  select-none flex flex-col justify-between gap-0 ${isOpen === true ? "translate-y-0 pointer-events-auto opacity-100" : "translate-y-full pointer-events-none opacity-0"} transition-all duration-300 drop-shadow-2xl border border-emerald-900/30 w-[96%] mx-2 left-0 rounded-t-xl bg-white z-50 p-4`}>
                {!activeBidRoom && [...rooms.myRooms, ...rooms.otherRooms].length === 0 && <GeneralBasicInformation animal={animal} />}
                <div className={`flex flex-col gap-4 ${activeBidRoom ? "bg-gradient-to-b from-amber-50 to-transparent" : "bg-white"} `}>
                    {activeBidRoom && <TheActualBidRoom handleLeaveRoom={handleLeaveRoom} isAuthor={isAuthor} socketState={socketState} activeBidRoom={activeBidRoom} animal={animal} />}
                    {!activeBidRoom?.userOfferAccepted && <div className='overflow-y-auto h-full max-h-[400px]' style={{ pointerEvents: isLocked && activeBidRoom ? "none" : "auto" }}>
                        {!activeBidRoom && <Rooms rooms={[...rooms?.myRooms, ...rooms?.otherRooms]} socket={socket} targetRoomKey={props.targetRoomKey} isOpen={isOpen} setExpectedKey={setExpectedKey} expectedKey={expectedKey} currentUser={user} animal={animal ?? null} isStaticStyle={props.staticStyle ?? false} />}
                        {
                            activeBidRoom && activeBidRoom.bids && finalBids.length !== 2 && activeBidRoom.bids.length > 0 && activeBidRoom?.bids?.map((bid: any, index: number) => {
                                return (
                                    <BidRow index={index} myLastOffer={myLastOffer} handleLockThisAsMyFinalOffer={handleLockThisAsMyFinalOffer} activeBidRoom={activeBidRoom} setOfferValue={setOfferValue} user={user} bid={bid} key={`${bid.id}-${index}`} isLocked={isLocked} socket={socket} />
                                )
                            })
                        }
                        {
                            tempMessageOnHold && (
                                <div key={tempMessageOnHold.id} className='animate-pulse text-zinc-700 opacity-90'>
                                    <BidRow index={-1} myLastOffer={myLastOffer} handleLockThisAsMyFinalOffer={handleLockThisAsMyFinalOffer} isTempMessage activeBidRoom={activeBidRoom} setOfferValue={setOfferValue} user={user} bid={tempMessageOnHold} key={`${tempMessageOnHold.id}`} isLocked={isLocked} socket={socket} />
                                </div>
                            )
                        }
                        {activeBidRoom && activeBidRoom.bids.length > 0 && <div className='mt-4 flex justify-center items-center'>
                            <div className='flex justify-center items-center gap-2'>
                                {isLocked && <div className='flex gap-1 items-center p-2 rounded-full bg-amber-200 border-2 border-amber-300 active:scale-75 transition-all duration-300 ease-in-out'>
                                    <LockIcon size={23} className='text-amber-700' />
                                </div>}
                            </div>
                        </div>}
                        <div ref={scrollHookRef}></div>
                    </div>}
                    {activeBidRoom && !activeBidRoom?.userOfferAccepted && finalBids && finalBids.length > 0 && <div className='flex flex-col justify-center items-center'>
                        {
                            finalBids.map((theBid: any, index: number) => {
                                return (
                                    <div className={`w-fit flex flex-col gap-1 items-center p-1 ${index === 0 && "border-b-2 border-zinc-500"}`} key={`${theBid?.id}-${index}`}>
                                        <div className={`${theBid.user.id === user?.id ? "text-emerald-700" : ""}`}>
                                            {
                                                formatCurrency(theBid.price)
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>}
                </div>
                <div className='w-full overflow-y-auto'>
                    {/* ALLOW BIDDING */}
                    {!isLocked && <div className='w-full fixed bottom-2 left-0 bg-white p-1 px-4 gap-2'>
                        {isAuthor && activeBidRoom && [...rooms.myRooms, ...rooms.otherRooms].length > 0 && <div className='my-4'>
                            <Textbox disabled={isLocked} onKeyDown={handlePlaceOfferKeyDown} label='Give Your Price' type='number' onChange={handleOfferChange} value={offerValue} className='text-center tracking-widest' />
                            <div className='italic text-sm tracking-wide mt-2 text-black/50'>{formalizeText(convertCurrencyToWords(Number(offerValue)))}</div>
                        </div>}
                        {!isAuthor && activeBidRoom && <div className='my-4'>
                            <Textbox disabled={isLocked} onKeyDown={handlePlaceOfferKeyDown} label='Give Your Price' type='number' onChange={handleOfferChange} value={offerValue} className='text-center tracking-widest' />
                            <div className='italic text-sm tracking-wide mt-2 text-black/50'>{formalizeText(convertCurrencyToWords(Number(offerValue)))}</div>
                        </div>}
                        <div className=' flex items-center gap-2'>
                            <Button onClick={() => handleLeaveRoom(!isAuthor)} className='w-full' variant='btn-secondary'>{!activeBidRoom ? "Close" : "Cancel"}</Button>
                            {activeBidRoom && <Button onClick={handlePostOffer} disabled={offerValue === 0} className='w-full'>Place Offer</Button>}
                        </div>
                    </div>}
                    {/* AUTHOR WILL NOW TAKE FINAL DECISION */}
                    {
                        isLocked && isAuthor && activeBidRoom && !activeBidRoom.closedAt && <div>
                            <div className='text-xl font-bold w-full text-center mb-2'>Please take a final decision</div>
                            <div className='flex justify-center items-center gap-4'>
                                {
                                    finalBids.length > 0 && finalBids.map((bid: any, index: number) => {
                                        if (!bid) return
                                        return (
                                            <Button onClick={() => handleCloseDeal(bid)} key={`${bid.id}-${index}`} variant={'btn-secondary'} className={`w-full`}>
                                                <div className='line-clamp-1'>{bid.user.id === user.id ? "Your's" : bid.user.name}</div>
                                                <div className='font-bold tracking-wide'>{formatCurrency(bid.price)}</div>
                                            </Button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                    {/* USER WILL WAIT FOR AUTHOR SELECTION */}
                    {
                        isLocked && !isAuthor && activeBidRoom && !activeBidRoom.closedAt && <div>
                            <div className='my-4 text-center'>⚠️ Your final offer has been placed, Please wait for the author to make the final decision.</div>
                            <div className='grid grid-cols-2 place-items-center gap-2 pointer-events-none'>
                                {
                                    finalBids.length > 0 && finalBids.map((bid: any, index: number) => {
                                        if (!bid) return
                                        return (
                                            <div key={`${bid.id}-${index}`} className='p-2 bg-white roundedpy-2 w-full flex flex-col justify-center items-center'>
                                                <div className='text-sm'>{bid.user.id === user.id ? "You" : bid.user.name}</div>
                                                <div className='tracking-wide'>{formatCurrency(bid.price)}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                    {/* AUTHOR HAS DECIDED */}
                    {
                        isLocked && selectedBid && activeBidRoom && activeBidRoom.closedAt && <div className='my-2 flex flex-col gap-2 items-center'>
                            <Image src={images.site.ui.handshake} alt='Bid Closed' width={100} height={100} layout='responsive' className='w-full h-auto' />
                            <div className='text-lg text-center p-2 px-4 bg-emerald-50 border-emerald-200 border rounded font-semibold tracking-wider text-emerald-800'>Deal closed at {formatCurrency(activeBidRoom.closedAmount ?? 0)}</div>
                            {/* <div className='text-center tracking-wide'>
                            {selectedBid.user.id === user.id ? "You" : selectedBid.user.name} has won the bid for <span className='font-semibold'>{animal.name}</span> with a final offer of <span className='font-semibold'>{formatCurrency(selectedBid.price)}</span>.
                        </div> */}
                            {
                                activeBidRoom.userOfferAccepted && isAuthor &&
                                <CTOButton activeBidRoomId={activeBidRoom.id} user={user} room={activeBidRoom} />
                            }
                            {
                                activeBidRoom.userOfferAccepted && !isAuthor &&
                                <div>Please wait for the author to call you.</div>
                            }
                        </div>
                    }
                </div>
            </div >
            <div onClick={handleCreateBidRoom} className={`w-full ${isOpen && "pointer-events-none opacity-50 scale-75"} w-full transition-all duration-100 ease-in-out`}>
                {props.staticStyle && props.children}
                {!props.staticStyle && isAuthor ?
                    <Button className='w-full'>{[...rooms.myRooms, ...rooms.otherRooms].length > 0 ? `(${thisRoomActiveBiders} active offer${[...rooms.myRooms, ...rooms.otherRooms].length > 0 && "s"})` : "No active bids"}</Button>
                    : null}
                {!props.staticStyle && !isAuthor ? props.children : null}
            </div>
            <div onClick={() => handleLeaveRoom(true)} className={`fixed ${isOpen === true ? "pointer-events-auto opacity-100 backdrop-blur-[1px]" : "pointer-events-none opacity-0"} top-0 left-0 inset-0 w-full h-full bg-black/50 z-10`}></div>
        </>
    )
}

export default BiddingWrapper

export function bidsReverse(bids: any[]) {
    let bidsCopy = []
    for (let i = bids.length - 1; i >= 0; i--) {
        bidsCopy.push(bids[i])
    }
    return bidsCopy
}
