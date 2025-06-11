"use client";

import { bidsReverse } from "@/components/controls/Bidding/BiddingWrapper";
import { useRooms } from "@/hooks/useRooms";
import { useSession } from "@/hooks/useSession";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Create a context for the socket instance
const SocketContext = createContext<Socket | null>(null);

// SocketProvider Props
interface SocketProviderProps {
    children: ReactNode;
}

// Create a provider to wrap the application
export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [user, setUser] = useState<any>(null);
    const getUser = useSession((state: any) => state.getUser);
    const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
    const rooms = useRooms()

    useEffect(() => {
        const rawUser = getUser();
        setUser(rawUser);
    }, [])

    useEffect(() => {
        let socket: any = null
        if (user) {
            let socket = io({
                query: {
                    userId: user.id, // Send user details as query
                },
            });

            socket.on("user-joined-bidroom", ({ room, userId }: any) => {
                rooms.addRoom(room, user)
            });
            socket.on("user-left-bidroom", ({ room, userId }) => {
                rooms.removeRoom(room.key, user)
            })
            socket.on("bid-placed", ({ bidRoom }) => {
                if (bidRoom) {
                    let newBids = bidsReverse(bidRoom.bids)
                    bidRoom.bids = newBids
                    rooms.addRoom(bidRoom, user)
                }
            })
            socket.on("bid-locked-as-final-offer", ({ room, userId }) => {
                let newBids = bidsReverse(room.bids)
                room.bids = newBids
                rooms.addRoom(room, user)
            })
            socket.on("deal-closed", ({ room, bid }) => {
                let newBids = bidsReverse(room.bids)
                room.bids = newBids
                rooms.addRoom(room, user)
            })
            socket.on("message-is-seen", ({ room, bidId }) => {
                const newBids = room.bids.map((bid: any) => bid.id === bidId ? { ...bid, isSeen: true } : bid)
                room.bids = newBids
                rooms.addRoom(room, user)
            })
            setSocketInstance(socket);
        } else {
            setSocketInstance(null);
        }

        console.info("Socket connection established.");


        return () => {
            if (socket) {
                socket.disconnect();
                console.info("Socket connection closed.");
                socket?.off("user-joined-bidroom");
                socket?.off("user-left-bidroom")
                socket?.off("bid-placed")
                socket?.off("bid-locked-as-final-offer")
                socket?.off("deal-closed")
                socket?.off("message-is-seen")
                setSocketInstance(null);
            }
        };
    }, [user]);

    return (
        <SocketContext.Provider value={socketInstance}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to access the socket instance
export const useSocket = () => {
    const context = useContext(SocketContext);
    return context ?? null; // Return null if context is not available
};
