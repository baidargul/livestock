'use client'
import React, { useEffect, useState } from "react";

type Props = {
    date: string; // starting date (e.g. createdAt)
    period: string; // expiry period like "1h", "1day 4h", "1month"
    className?: string;
};

// helper: parse period string into milliseconds
const parsePeriod = (period: string): number => {
    const regex = /(\d+)\s*(h|hr|hrs|hour|hours|d|day|days|m|mo|month|months)/gi;
    let totalMs = 0;

    let match;
    while ((match = regex.exec(period)) !== null) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();

        if (["h", "hr", "hrs", "hour", "hours"].includes(unit)) {
            totalMs += value * 60 * 60 * 1000;
        } else if (["d", "day", "days"].includes(unit)) {
            totalMs += value * 24 * 60 * 60 * 1000;
        } else if (["m", "mo", "month", "months"].includes(unit)) {
            // approx 30 days
            totalMs += value * 30 * 24 * 60 * 60 * 1000;
        }
    }
    return totalMs;
};

// helper: format ms into "Xd Xh Xm Xs"
const formatRemaining = (ms: number): string => {
    if (ms <= 0) return "Expired";

    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / (1000 * 60)) % 60;
    const hr = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const day = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts = [];
    if (day > 0) parts.push(`${day}d`);
    if (hr > 0) parts.push(`${hr}h`);
    if (min > 0) parts.push(`${min}m`);
    if (sec > 0) parts.push(`${sec}s`);

    return parts.join(" ");
};

const ExpiryTimeControl = ({ date, period, className }: Props) => {
    const [remaining, setRemaining] = useState("")

    useEffect(() => {
        if (!date || !period) return;

        const start = new Date(date).getTime();
        const expiryDuration = parsePeriod(period);
        const expiryTime = start + expiryDuration;

        const tick = () => {
            const now = Date.now();
            const msLeft = expiryTime - now;
            setRemaining(formatRemaining(msLeft));
        };

        tick(); // run immediately
        const interval = setInterval(tick, 1000);

        return () => clearInterval(interval);
    }, [date, period]);

    if (!remaining) return null;

    return (
        <div className={`text-xs font-medium ${className}`}>
            {remaining}
        </div>
    );
};

export default ExpiryTimeControl;
