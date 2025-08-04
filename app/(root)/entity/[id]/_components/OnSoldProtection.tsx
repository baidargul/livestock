'use client'
import { useSocket } from '@/socket-client/SocketWrapper'
import { Animal } from '@prisma/client'
import { deserialize } from 'bson'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
    animal: any
}

const OnSoldProtection = (props: Props) => {
    const router = useRouter()
    const socket = useSocket()

    useEffect(() => {
        if (socket) {

            socket.on("sold", (binaryData) => {
                const { animalId } = deserialize(binaryData);
                if (animalId === props.animal.id) {
                    router.refresh()
                }
            })

            return () => {
                socket.off("sold")
            }
        }
    }, [socket])

    return null
}

export default OnSoldProtection