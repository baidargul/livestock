'use client';
import React, { useEffect, useState } from 'react';
import { actions } from '@/actions/serverActions/actions';
import { calculatePricing } from '@/lib/utils';
import { useSession } from '@/hooks/useSession';
import dynamic from 'next/dynamic';
type Props = { animalId: string };

const BidTradeViewChart = dynamic(
    () => import('@/components/Animals/BidTradeView/BidTradeViewChart'),
    { ssr: false }
);

export default function BidTradeView({ animalId }: Props) {
    const getUser = useSession((s: any) => s.getUser);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthor, setIsAuthor] = useState<boolean>(false);
    const [bids, setBids] = useState<any[]>([]);

    // load userId once on mount
    useEffect(() => {
        const raw = getUser();
        if (raw?.id) setUserId(raw.id);
    }, [getUser]);

    // poll bids every 5s
    useEffect(() => {
        if (!userId) return;

        const fetchBids = async () => {
            const res = await actions.client.bidRoom.bidding.onAnimal(animalId);
            if (res.status === 200) {
                const price = calculatePricing(res.data).price;
                if (res.data.userId === userId) setIsAuthor(true);

                // keep only first `initial` and all others
                let seenInitial = false;
                const initialBidId = res.data.bids[res.data.bids.length - 1]?.id;
                const filtered = res.data.bids.filter((b: any) => {
                    if (b.userId === userId) b.user.name = 'You';
                    if (b.intial) {
                        if (!seenInitial && b.id === initialBidId) {
                            seenInitial = true;
                            return true;
                        }
                        return false;
                    }
                    return true;
                });
                setBids(filtered);
            }
        };

        fetchBids();                   // initial fetch
        const iv = setInterval(fetchBids, 5000);
        return () => clearInterval(iv);
    }, [userId, animalId]);

    // Always render the chart; let it handle empty data
    return (
        <BidTradeViewChart
            bids={bids}
            byUser={isAuthor}
        />
    );
}
