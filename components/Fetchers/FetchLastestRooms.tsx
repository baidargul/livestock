'use client'
import { useRooms } from '@/hooks/useRooms';
import { useSession } from '@/hooks/useSession';
import { useEffect, useState } from 'react';

type Props = {}

const FetchLastestRooms = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const getUser = useSession((state: any) => state.getUser);
    const getLatestRooms = useRooms((state: any) => state.getLatestRooms);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(() => {
        if (isMounted) {
            const rawUser = getUser();
            setUser(rawUser);
        }
    }, [isMounted])

    useEffect(() => {
        if (isMounted && user) {
            getLatestRooms(user.id)
        }
    }, [user])

    return (
        null
    )
}

export default FetchLastestRooms