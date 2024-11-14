'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useUser, UserButton } from '@clerk/nextjs'

function Header() {
    const { user, isSignedIn } = useUser();
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div 
            className={`px-8 py-6 flex justify-between items-center border shadow-sm font-sans transition-transform duration-500 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}
            style={{ backgroundColor: 'white', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}
        >
            <div className="flex items-center">
                {/* Logo and Name */}
                <Image 
                    src={'/logo/Transparent logo.png'} 
                    alt='logo' 
                    width={40} 
                    height={25} 
                    className='mr-3' 
                />
                <span className='text-[#2d5cda] font-bold text-2xl'>Swift</span>
            </div>

            {isSignedIn ? (
                <UserButton />
            ) : (
                <div className='flex justify-center gap-8 items-center'>
                    {['Home', 'Available on', 'Blog', 'Founding Story', 'Privacy Policy', 'T&C'].map((label, index) => (
                        <Link href={`#${label.replace(/\s+/g, '-').toLowerCase()}`} key={index}>
                            <button 
                                className='relative text-black hover:text-[#2d5cda] transition-colors font-sans group'
                            >
                                {label}
                                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#2d5cda] transition-all duration-300 group-hover:w-full"></span>
                            </button>
                        </Link>
                    ))}
                    <Link href="/sign-in">
                        <Button 
                            className="rounded-full font-sans transform transition-transform hover:scale-105"
                            style={{ backgroundColor: '#2d5cda', color: 'white' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#244aad'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d5cda'}
                        >
                            <span className="relative inline-block text-base font-semibold tracking-wide transition-transform hover:animate-bounce">
                                Get Started
                            </span>
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Header;
