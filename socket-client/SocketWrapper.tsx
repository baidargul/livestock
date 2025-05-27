"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Create a context for the socket instance
const SocketContext = createContext<Socket | null>(null);

// Initialize the socket instance
export const socket = io(); // Add your server URL here if required, e.g., io("http://localhost:3000");

// SocketProvider Props
interface SocketProviderProps {
    children: ReactNode;
}

// Create a provider to wrap the application
export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

    useEffect(() => {
        // Set the socket instance once the component mounts
        setSocketInstance(socket);

        // Clean up on unmount
        return () => {
            socket.disconnect();
        };
    }, []);


    return (
        <SocketContext.Provider value={socketInstance}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to access the socket instance
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
