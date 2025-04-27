'use client';

import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import PhoneFooter from '@/components/website/footer/Phone';
import PhoneHeaderHome from '@/components/website/header/home/Phone';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmFpZGFyZ3VsIiwiYSI6ImNtOXltcHh1bDA0MDMybG9nN2FqM3diZGoifQ.2rn1oEkLLbc_QVQL7UVXNw';

const LiveLocation = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [userInteracted, setUserInteracted] = useState(false); // Track user interaction


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

        // Listen for user interaction (zooming/panning)
        mapRef.current.on('moveend', () => setUserInteracted(true));
        mapRef.current.on('zoomend', () => setUserInteracted(true));

        mapRef.current.on('load', () => {
            // markerRef.current = new mapboxgl.Marker({ anchor: 'center' })
            //     .setLngLat([0, 0])
            //     .addTo(mapRef.current!);
        });

        const watchId = navigator.geolocation.watchPosition(
            ({ coords }) => {
                const { latitude, longitude } = coords;
                setLocation({ lat: latitude, lng: longitude });

                // Only re-center map if user hasn't interacted
                // if (!userInteracted) {
                //     mapRef.current!.setCenter([longitude, latitude]);
                // }

                // // Always update marker position
                // markerRef.current!.setLngLat([longitude, latitude]);
            },
            (err) => console.error('Geolocation error:', err),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        return () => {
            // navigator.geolocation.clearWatch(watchId);
            mapRef.current!.remove();
        };
    }, []);

    console.log(location)

    return (
        <div className="w-full select-none min-h-[100dvh] flex flex-col justify-between">
            <style>
                {` .mapboxgl-control-container{
                    display: none !important;
                }`}
            </style>

            <PhoneHeaderHome />
            <div ref={mapContainer} className="relative w-full  h-full flex justify-center items-center" />
            {location && (
                <div className="absolute top-32 left-2 z-20 bg-white p-2 rounded shadow">
                    <p>Latitude: {location.lat.toFixed(6)}</p>
                    <p>Longitude: {location.lng.toFixed(6)}</p>
                    <button
                        className="mt-2 px-3 py-1 bg-emerald-600 text-white rounded"
                        onClick={() => {
                            // Let user manually adjust marker
                            mapRef.current!.getContainer().style.cursor = 'crosshair';
                            const onClick = (e: mapboxgl.MapMouseEvent) => {
                                markerRef.current!.setLngLat(e.lngLat);
                                setLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng });
                                mapRef.current!.off('click', onClick);
                                mapRef.current!.getContainer().style.cursor = '';
                            };
                            mapRef.current!.on('click', onClick);
                        }}
                    >
                        Adjust Location
                    </button>
                </div>
            )}
            <PhoneFooter />
        </div>
    );
};

export default LiveLocation;
