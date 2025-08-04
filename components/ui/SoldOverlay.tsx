'use client'
import { images } from '@/consts/images'
import { useSocket, useUser } from '@/socket-client/SocketWrapper'
import { Animal } from '@prisma/client'
import { deserialize } from 'bson'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    animal: any
    children: React.ReactNode
}

const SoldOverlay = (props: Props) => {
    const [animal, setAnimal] = useState<Animal | any>(null)
    const user = useUser()
    const socket = useSocket()

    useEffect(() => {
        if (socket) {
            socket.on("sold", (binaryData) => {
                const { animalId } = deserialize(binaryData);
                if (animalId === animal.id) {
                    setAnimal({ ...animal, sold: true })
                }
            })

            return () => {
                socket.off("sold")
            }
        }
    }, [socket, user])

    useEffect(() => {
        setAnimal(props.animal)
    }, [props.animal])
    return (
        <div className='w-full h-full relative'>
            {props.children}
            {animal?.sold && <div className='absolute bottom-0 left-0 z-50 pointer-events-none w-full h-full bg-gradient-to-t from-white to-transparent flex justify-center items-center'>
                <Image src={images.site.ui.sold} alt='sold' width={100} height={100} layout='fixed' className='w-full mt-auto' />
            </div>}
        </div>
    )
}

export default SoldOverlay