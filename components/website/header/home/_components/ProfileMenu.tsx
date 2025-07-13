'use client';
import UserProfileIcon from '@/components/website/profile/Icon';
import { images } from '@/consts/images';
import { useSession } from '@/hooks/useSession';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

type Props = {};

const ProfileMenu = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const getUser = useSession((state: any) => state.getUser);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleMenuClick = (val: boolean) => {
        setIsOpen(val);
    };

    useEffect(() => {
        const rawUser = getUser();
        setUser(rawUser);
    }, []);

    // 👇 Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!user) {
        return <div>Login</div>;
    }

    return (
        <div ref={menuRef} className="relative">
            <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => handleMenuClick(!isOpen)}
            >
                <Image
                    src={
                        user?.profileImage?.[0]?.image ||
                        images.site.placeholders.userProfile
                    }
                    draggable={false}
                    width={40}
                    height={40}
                    layout="fixed"
                    loading="lazy"
                    quality={100}
                    alt="janwarmarkaz"
                    className="rounded-full bg-white p-1 object-cover w-10 h-10 pointer-events-none"
                />
                <span className="font-semibold">{user.name}</span>
            </div>
            {isOpen && (
                <div className="absolute top-12 w-full left-0 z-[2] bg-white rounded p-2 shadow-lg">
                    <div className="menu-item text-sm">Profile</div>
                    <div className="menu-item text-sm">My Demands</div>
                    <div className="menu-item text-sm">My Listings</div>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
