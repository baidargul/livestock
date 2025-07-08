'use client'
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { formatCurrency } from '@/lib/utils';

interface Bid {
    id: string;
    price: number;
    createdAt: string;
    user: { id: string; name: string }; // assuming user info available
}
interface BiddingChartProps {
    bids: Bid[];
    byUser?: boolean;
}

export default function BidTradeViewChart({ bids, byUser }: BiddingChartProps) {
    const [series, setSeries] = useState<{ name?: string; data: [number, number][] }[]>([]);

    // Prepare grouped or single-series data
    const computeSeries = () => {
        // Map bids to [timestamp, price]
        const mapped = bids.map(b => ({
            time: new Date(b.createdAt).getTime(),
            price: b.price,
            userId: b.user.id,
            userName: b.user.name,
        }));

        if (byUser) {
            // Group by user
            const groups: Record<string, { name: string; data: [number, number][] }> = {};
            mapped.forEach(({ time, price, userId, userName }) => {
                if (!groups[userId]) {
                    groups[userId] = { name: userName, data: [] };
                }
                groups[userId].data.push([time, price]);
            });
            // Sort each series
            return Object.values(groups).map(group => ({
                name: group.name,
                data: group.data.sort((a, b) => a[0] - b[0]),
            }));
        } else {
            // Single series of all bids
            const data = mapped
                .map(({ time, price }) => [time, price] as [number, number])
                .sort((a, b) => a[0] - b[0]);
            return [{ data }];
        }
    };

    const bidSeries = computeSeries();
    const allTimes = bidSeries.flatMap(s => s.data.map(p => p[0]));
    const xMin = allTimes.length ? Math.min(...allTimes) : Date.now();
    const xMax = allTimes.length ? Math.max(...allTimes) : Date.now();

    const options: ApexOptions = {
        chart: {
            id: 'bidding-chart',
            height: 350,
            type: 'line',
            animations: { enabled: true, dynamicAnimation: { speed: 1000 } },
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: any) => formatCurrency(val),
            offsetY: -10,
            style: { fontSize: '12px', colors: ['#304758'] },
        },
        stroke: { curve: 'smooth', width: 2 },
        markers: { size: 6 },
        title: { text: `Last Bid: ${formatCurrency(bids[0]?.price ?? 0)}`, align: 'left' },
        xaxis: {
            type: 'datetime',
            min: xMin,
            max: xMax,
            labels: { datetimeUTC: false, format: 'hh:mm:ss a' },
            tickAmount: Math.min(allTimes.length, 6),
        },
        yaxis: {
            labels: { formatter: (val) => formatCurrency(val) },
            max: Math.max(...bids.map(b => b.price)) * 1.1,
            min: Math.min(...bids.map(b => b.price)) * 0.9,
        },
        tooltip: {
            x: { format: 'hh:mm:ss a' },
            y: { formatter: (val) => formatCurrency(val) },
        },
        legend: { show: byUser || false, position: 'top' },
        series: bidSeries,
    };

    useEffect(() => {
        setSeries(bidSeries);
    }, [bids, byUser]);

    return <Chart options={options} series={series} type="line" height={350} />;
}