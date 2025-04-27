'use client';

import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import PhoneFooter from '@/components/website/footer/Phone';
import PhoneHeaderHome from '@/components/website/header/home/Phone';
import { LocateIcon } from 'lucide-react';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmFpZGFyZ3VsIiwiYSI6ImNtOXltcHh1bDA0MDMybG9nN2FqM3diZGoifQ.2rn1oEkLLbc_QVQL7UVXNw';

const LiveLocation = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [userInteracted, setUserInteracted] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [0, 0],
            zoom: 15,
        });

        // Add these CSS fixes
        const canvasContainer = mapRef.current.getCanvasContainer();
        canvasContainer.style.transform = 'none';
        const canvas = mapRef.current.getCanvas();
        canvas.style.position = 'static';

        mapRef.current.on('moveend', () => setUserInteracted(true));
        mapRef.current.on('zoomend', () => setUserInteracted(true));

        const watchId = navigator.geolocation.watchPosition(
            ({ coords }) => {
                const { latitude, longitude } = coords;
                setLocation({ lat: latitude, lng: longitude });

                if (!userInteracted) {
                    mapRef.current!.setCenter([longitude, latitude]);
                }

                if (!markerRef.current) {
                    // Create marker on first position update
                    markerRef.current = new mapboxgl.Marker({
                        anchor: 'center',
                        offset: [0, -15] // Adjust if needed for precise placement
                    })
                        .setLngLat([longitude, latitude])
                        .addTo(mapRef.current!);
                } else {
                    markerRef.current.setLngLat([longitude, latitude]);
                }
            },
            (err) => console.error('Geolocation error:', err),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
            mapRef.current?.remove();
        };
    }, []);

    return (
        <div className="w-full select-none min-h-[100dvh] flex flex-col justify-between">
            <style>
                {` 
                .mapboxgl-control-container { display: none !important; }
                .mapboxgl-canvas-container { transform: none !important; }
                .mapboxgl-canvas { position: static !important; }
                `}
            </style>

            <PhoneHeaderHome />
            <div
                ref={mapContainer}
                className="w-[400px] h-[400px] flex justify-center items-center mx-auto relative"
            />

            {location && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 bg-white p-2 rounded shadow">
                    <div className='flex items-center gap-2'>
                        <p>Lat: <span className='p-1 bg-zinc-100 text-sm font-mono rounded border'>{location.lat.toFixed(6)}</span></p>
                        <p>Lon: <span className='p-1 bg-zinc-100 text-sm font-mono rounded border'>{location.lng.toFixed(6)}</span></p>
                        <button
                            className="p-1 px-2 ml-4 bg-emerald-600 text-white rounded"
                            onClick={() => {
                                const map = mapRef.current!;
                                map.getContainer().style.cursor = 'crosshair';

                                const clickHandler = (e: mapboxgl.MapMouseEvent) => {
                                    const newPos = e.lngLat;
                                    markerRef.current!.setLngLat(newPos);
                                    setLocation({ lat: newPos.lat, lng: newPos.lng });
                                    map.off('click', clickHandler);
                                    map.getContainer().style.cursor = '';
                                };

                                map.on('click', clickHandler);
                            }}
                        >
                            <LocateIcon className='w-4 h-4' />
                        </button>
                    </div>
                </div>
            )}
            <PhoneFooter />
        </div>
    );
};

export default LiveLocation;