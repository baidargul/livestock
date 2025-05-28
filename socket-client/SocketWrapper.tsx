"use client";

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

            setSocketInstance(socket);
        } else {
            setSocketInstance(null);
        }

        console.info("Socket connection established.");

        return () => {
            if (socket) {
                socket.disconnect();
                console.info("Socket connection closed.");
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
