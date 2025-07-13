import React from 'react'
import SiteLogo from '../logo/SiteLogo'

type Props = {}

const DesktopFooter = (props: Props) => {
    return (
        <div className='w-full p-4 py-10 bg-zinc-100 border-t border-zinc-200 mt-10'>
            <div className='grid grid-cols-[auto_1fr] gap-10 w-full'>
                <div className='mr-auto px-10 flex flex-col text-center justify-center items-center'>
                    <SiteLogo size='lg' />
                    <div className='font-semibold tracking-tight text-zinc-700 text-lg'>Janwar Markaz</div>
                    <div className='text-zinc-500 text-sm'>Your trusted animal marketplace</div>
                </div>
                <div className='grid grid-cols-4 w-full ml-auto'>
                    <div>
                        <h6 className='font-semibold text-zinc-700 text-sm'>Quick Links</h6>
                        <ul>
                            <li><a href='#' className='text-zinc-500 text-sm'>Home</a></li>
                            <li><a href='#' className='text-zinc-500 text-sm'>About Us</a></li>
                            <li><a href='#' className='text-zinc-500 text-sm'>Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className='font-semibold text-zinc-700 text-sm'>Categories</h6>
                        <ul>
                            <li><a href='#' className='text-zinc-500 text-sm'>Dogs</a></li>
                            <li><a href='#' className='text-zinc-500 text-sm'>Cats</a></li>
                            <li><a href='#' className='text-zinc-500 text-sm'>Birds</a></li>
                            <li><a href='#' className='text-zinc-500 text-sm'>Fish</a></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className='font-semibold text-zinc-700 text-sm'>Help & Support</h6>
                        <ul>
                            <li><a href='#' className='text-zinc-500 text-sm'>FAQs</a></li>
                            <li><a href='#' className='text-zinc-500 text-sm'>Terms & Conditions</a></li>
                            <li><a href='#' className='text-zinc-500 text-sm'>Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className='font-semibold text-zinc-700 text-sm'>Stay Connected</h6>
                        <ul>
                            <li><a href='#' className='text-zinc-500 text-sm'>Facebook</a></li>
                            <li><a href='#' className='text-zinc-500 text-sm'>Twitter</a></li>
                            <li><a href='#' className='text-zinc-500 text-sm'>Instagram</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DesktopFooter