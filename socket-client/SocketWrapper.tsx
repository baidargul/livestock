"use client";

import { bidsReverse } from "@/components/controls/Bidding/BiddingWrapper";
import { useLoader } from "@/hooks/useLoader";
import { useRooms } from "@/hooks/useRooms";
import { useSession } from "@/hooks/useSession";
import { deserialize } from "bson";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Create a context for the socket instance
const SocketContext = createContext<Socket | null>(null);

// Create a context for the user data
const UserContext = createContext<any>(null);

// SocketProvider Props
interface SocketProviderProps {
    children: ReactNode;
}

// Create a provider to wrap the application
export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const getUser = useSession((state: any) => state.getUser);
    const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
    const setLoading = useLoader((state: any) => state.setLoading);
    const rooms = useRooms();

    useEffect(() => {
        const rawUser = getUser();
        setUser(rawUser);
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            let socket: any = null;
            if (user) {
                let socket = io({
                    // let socket = io('https://janwarmarkaz-ca4ca354a024.herokuapp.com', {
                    query: {
                        userId: user.id, // Send user details as query
                    },
                });
                socket.on("user-joined-bidroom", (binaryData) => {
                    const { room, userId }: any = deserialize(binaryData);
                    let newBids = bidsReverse(room.bids);
                    room.bids = newBids;
                    rooms.addRoom(room, user);
                });
                socket.on("user-left-bidroom", (binaryData) => {
                    const { room, userId } = deserialize(binaryData);
                    if (room) {
                        let newBids = bidsReverse(room.bids);
                        room.bids = newBids;
                        rooms.addRoom(room, user);
                        // rooms.removeRoom(room.key, user)
                    }
                });
                socket.on("bid-placed", (binaryData) => {
                    const { room, userId } = deserialize(binaryData);
                    if (room) {
                        let newBids = bidsReverse(room.bids);
                        room.bids = newBids;
                        rooms.addRoom(room, user);
                    }
                });
                socket.on("bid-locked-as-final-offer", (binaryData) => {
                    const { room, userId } = deserialize(binaryData);
                    let newBids = bidsReverse(room.bids);
                    room.bids = newBids;
                    rooms.addRoom(room, user);
                    setLoading(false);
                });
                socket.on("deal-closed", (binaryData) => {
                    const { room, bid } = deserialize(binaryData);
                    const rawRoom = { ...room.room };
                    let newBids = bidsReverse(rawRoom.bids);
                    rawRoom.bids = newBids;
                    rooms.addRoom(rawRoom, user);
                });
                socket.on("message-is-seen", (binaryData) => {
                    const { room, bidId } = deserialize(binaryData);
                    const newBids = room.bids.map((bid: any) => bid.id === bidId ? { ...bid, isSeen: true } : bid);
                    room.bids = newBids;
                    rooms.addRoom(room, user);
                });
                socket.on("room-closed", (binaryData) => {
                    const { room, userId } = deserialize(binaryData);
                    if (room) {
                        rooms.removeRoom(room.key);
                    }
                });
                setSocketInstance(socket);
            } else {
                setSocketInstance(null);
            }

            return () => {
                if (socket) {
                    socket.disconnect();
                    socket?.off("user-joined-bidroom");
                    socket?.off("user-left-bidroom");
                    socket?.off("bid-placed");
                    socket?.off("bid-locked-as-final-offer");
                    socket?.off("deal-closed");
                    socket?.off("room-closed");
                    socket?.off("message-is-seen");
                    setSocketInstance(null);
                }
            };
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socketInstance}>
            <UserContext.Provider value={user}>
                {children}
            </UserContext.Provider>
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    return context ?? null; // Return null
};

export const useUser = () => {
    const context = useContext(UserContext);
    return context ?? null; // Return null
};