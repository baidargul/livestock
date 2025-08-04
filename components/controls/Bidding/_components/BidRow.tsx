'use client'
import { formatCurrency } from '@/lib/utils';
import { serialize } from 'bson';
import { CheckCheckIcon, LockIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    bid: any
    user: any
    activeBidRoom: any
    isLocked: boolean
    index: number
    setOfferValue: (val: number) => void
    socket: any
    isTempMessage?: boolean
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
                ? "bg-zinc-100"
                : ""
                } flex justify-between items-center border-b tracking-tight border-zinc-100 hover:bg-gradient-to-l hover:bg-zinc-100/70 to:bg-transparent cursor-pointer`}
        >
            <div className="tracking-tight">
                {props.user.id === props.bid.userId ? "You" : props.bid.user.name}
            </div>
            <div
                className={`tracking-wide flex gap-1 items-center justify-center ${props.index === props.activeBidRoom.bids.length - 1 && "text-emerald-700 font-bold"
                    }`}
            >
                {props.bid?.isFinalOffer && <LockIcon size={15} className="text-amber-700" />}
                {formatCurrency(props.bid.price)}
            </div>
            {props.user.id === props.bid.userId && !props.isTempMessage && (
                <div className="absolute bottom-0 right-2 flex justify-center items-center gap-1">
                    <CheckCheckIcon
                        size={14}
                        className={`${props.bid.isSeen === true ? "text-emerald-500" : "text-zinc-500"
                            }`}
                    />
                </div>
            )}
        </div>
    )
}

export default BidRow