'use client'
import { actions } from '@/actions/serverActions/actions';
import Button from '@/components/ui/Button';
import Textbox from '@/components/ui/Textbox';
import { images } from '@/consts/images';
import { useLoader } from '@/hooks/useLoader';
import { useSession } from '@/hooks/useSession';
import { formatCurrency } from '@/lib/utils';
import { useSocket } from '@/socket-client/SocketWrapper';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type Props = {
    children?: React.ReactNode;
    demand: any;
}

const FullfilmentWrapper = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const [posts, setPosts] = useState<any[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
    const [searchCriteria, setSearchCriteria] = useState<string>('');
    const [user, setUser] = useState<any>(null);
    const [currentSelection, setCurrentSelection] = useState<number>(-1);
    const getUser = useSession((state: any) => state.getUser);
    const setLoading = useLoader((state: any) => state.setLoading);
    const router = useRouter();
    const socket = useSocket()

    useEffect(() => {
        setIsMounted(true);

        return () => {
            setIsMounted(false);
            setUser(null);
            setIsOpen(false);
        }
    }, [])

    useEffect(() => {
        if (isMounted && isOpen) {
            const rawUser = getUser();
            setUser(rawUser);
        }
    }, [isMounted, isOpen]);

    useEffect(() => {
        if (user && isOpen) {
            fetchThisUserPosts();
        }
    }, [user])


    const fetchThisUserPosts = async () => {
        setLoading(true);
        const response = await actions.client.posts.listByUser(user.id);
        if (response.status === 200) {
            setPosts(response.data);
            setFilteredPosts(response.data);
            setCurrentSelection(-1);
        } else {
            console.error("Failed to fetch user posts:", response);
            return [];
        }
        setLoading(false);
    }

    const handleLeaveRoom = async (force?: boolean) => {
        if (force) {
            setIsOpen(false);
            return;
        }
        setIsOpen(!isOpen);
    }

    const handleSelect = (index: number) => {
        if (currentSelection === index) {
            setCurrentSelection(-1);
            return;
        }
        setCurrentSelection(index);
    }

    const handleSearchCriteria = (e: string) => {
        setSearchCriteria(e);
    }

    if (!isMounted) {
        return props.children || <></>;
    }

    const handleFulFilRequest = async () => {
        if (currentSelection === -1) {
            return;
        }

        if (props.demand.userId === user.id) {
            alert("You cannot fulfill your own demand.");
            return;
        }

        setLoading(true);
        const animal = filteredPosts[currentSelection];
        if (socket && user) {
            const room = {
                animalId: animal.id,
                authorId: animal.userId,
                userId: props.demand.userId,
                key: `${animal.id}-${animal.userId}-${props.demand.userId}`,
            }
            socket.emit("join-bidroom", { room, userId: user.id, demandId: props.demand.id });
            setIsOpen(false);
            router.push(`/entity/${animal.id}`);
        }
        setLoading(false);
    }

    return (
        <>
            <div className={`fixed bottom-14 h-[80%] select-none flex flex-col justify-between gap-2 ${isOpen === true ? "translate-y-0 pointer-events-auto opacity-100" : "translate-y-full pointer-events-none opacity-0"} transition-all duration-300 drop-shadow-2xl border border-emerald-900/30 w-[96%] mx-2 left-0 rounded-t-xl bg-white z-20 p-4`}>
                <div className=''>
                    <Textbox label='Search' value={searchCriteria} onChange={handleSearchCriteria} />
                </div>
                <div className=''>
                    {
                        filteredPosts.length > 0 ? (
                            <div className='grid grid-cols-2 gap-2 w-full overflow-y-auto h-[60%] pb-10'>
                                {
                                    filteredPosts.map((animal: any, index: number) => {

                                        if (searchCriteria.length > 0) {
                                            const isExists =
                                                animal.type.toLowerCase().includes(searchCriteria.toLowerCase()) ||
                                                animal.breed.toLowerCase().includes(searchCriteria.toLowerCase()) ||
                                                animal.title.toLowerCase().includes(searchCriteria.toLowerCase())

                                            if (!isExists) {
                                                return null;
                                            }

                                        }

                                        return (
                                            <div onClick={() => handleSelect(index)} key={`${animal.id}-${index}`} className={`drop-shadow-sm ${index === currentSelection ? "bg-emerald-50" : "bg-white"}  rounded-md p-2 cursor-pointer`}>
                                                <Image src={animal.images[0]?.image || images.chickens.covers[0]} width={300} height={200} alt={animal.title} layout='fixed' quality={70} className='w-full h-[100px] object-cover rounded-lg' />
                                                <div className='text-lg font-semibold'>{animal.title}</div>
                                                <div className='text -mt-1 tracking-tight'>{animal.description}</div>
                                                <div className='text-2xl font-semibold tracking-widest -mt-1 text-right text-emerald-600'>{formatCurrency(animal.price)}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        ) : (
                            <div className='text-sm text-zinc-600'>No listings found</div>
                        )
                    }
                    <div className='grid grid-cols-2 w-full gap-2 mt-3'>
                        <Button onClick={() => handleLeaveRoom(true)} variant='btn-secondary' className='w-full'>Cancel</Button>
                        <Button onClick={handleFulFilRequest} className='w-full' disabled={currentSelection === -1} >Select</Button>
                    </div>
                </div>
            </div>
            <div onClick={() => setIsOpen(true)} className='w-full'>{props.children}</div>
            <div onClick={() => handleLeaveRoom(true)} className={`fixed ${isOpen === true ? "pointer-events-auto opacity-100 backdrop-blur-[1px]" : "pointer-events-none opacity-0"} top-0 left-0 inset-0 w-full h-full bg-black/50 z-10`}></div>
        </>
    )
}

export default FullfilmentWrapper