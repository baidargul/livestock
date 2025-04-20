import React from 'react'
import Client from './_components/Client'

type Props = {}

const page = (props: Props) => {
    return (
        <div className='relative w-full min-h-screen' style={{ backgroundImage: `url(./media/2025-04-20_21-45-18_7037.png)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundPositionX: "-111px", backgroundPositionY: "-20px" }}>
            <div className='rounded-t-[90px] transition-all duration-200 ease-in-out bg-white absolute bottom-0 z-20 w-full h-1/2 p-10 pt-5 sm:pt-10' style={{ boxShadow: "1px 11px 20px 9px #f60405" }}>
                <Client />
            </div>
        </div>
    )
}

export default page