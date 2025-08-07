'use client'
import { formatCurrency } from '@/lib/utils';
import { serialize } from 'bson';
import { CheckCheckIcon, LockIcon, LockOpenIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import ElapsedTimeControl from '../../ElapsedTimeControl';

type Props = {
    bid: any
    user: any
    activeBidRoom: any
    isLocked: boolean
    index: number
    setOfferValue: (val: number) => void
    socket: any
    isTempMessage?: boolean
    handleLockThisAsMyFinalOffer: () => void
    myLastOffer: string | number
}

const BidRow = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const bidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !props.bid.isSeen && props.user.id !== props.bid.userId) {
                            if (props.bid.userId !== props.user.id) { // Call function when visible by other user
                                handleMessageSeen(props.bid.id);
                                observer.disconnect(); // Stop observing this element after marking as seen
                            }
                        }
                    });
                },
                { threshold: 0.5 } // 50% of the element needs to be visible
            );

            if (bidRef.current) {
                observer.observe(bidRef.current);
            }

            return () => {
                if (bidRef.current) {
                    observer.unobserve(bidRef.current);
                }
            };
        }
    }, [isMounted, props.bid]);

    const handleMessageSeen = (bidId: string) => {
        const socket = props.socket
        socket.emit("message-seen", serialize({ bidId, room: props.activeBidRoom }));
    };

    return (
        isMounted && props.user && props.activeBidRoom && <div
            ref={bidRef}
            onClick={() => {
                !props.isLocked && props.setOfferValue(props.bid.price);
            }}
            key={`${props.bid.id}-${props.index}`}
            className={`p-2 relative ${props.user.id === props.bid.userId
                ? "bg-emerald-100 pr-5 w-fit ml-auto"
                : "bg-white border border-zinc-200 w-fit pl-5 mr-auto"
                } rounded mx-1`}
        >
            <div className='flex gap-4 items-center'>
                <div>
                    <div
                        className={`tracking-wide flex gap-1 items-center justify-start ${props.user.id === props.bid.userId ? "" : ""} ${props.index === props.activeBidRoom.bids.length - 1 && "text-black font-bold"
                            }`}
                    >
                        {props.bid?.isFinalOffer && <LockIcon size={15} className="text-amber-700" />}
                        {formatCurrency(props.bid.price)}
                    </div>
                    <div className="flex justify-between items-center gap-1">
                        <ElapsedTimeControl date={props.bid.createdAt} />
                        {props.user.id === props.bid.userId && !props.isTempMessage && (
                            <CheckCheckIcon
                                size={14}
                                className={`${props.bid.isSeen === true ? "text-emerald-700" : "text-zinc-600"
                                    }`}
                            />
                        )}
                    </div>
                </div>
                {props.user.id === props.bid.userId && !props.isTempMessage && !props.isLocked && Number(props.myLastOffer) === Number(props.bid.price) && <LockOpenIcon onClick={props.handleLockThisAsMyFinalOffer} size={15} className={`${props.user.id === props.bid.userId ? "ml-auto cursor-pointer hover:fill-yellow-200" : ""}`} />}
            </div>
        </div>
    )
}

export default BidRow