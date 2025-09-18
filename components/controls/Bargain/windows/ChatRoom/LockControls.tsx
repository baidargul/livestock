import React from 'react'

type Props = {
    handleToggleLockControls: (val: boolean) => void
}

const LockControls = (props: Props) => {
    return (
        <div className='text-sm tracking-tight mt-4 flex flex-col gap-2'>
            <div>Are you sure to make this final offer?</div>
            <div className='flex justify-evenly gap-2 items-center'>
                <div className='p-1 px-2 cursor-pointer hover:bg-emerald-50 border border-emerald-600 w-full rounded text-center'>Yes</div>
                <div onClick={() => { props.handleToggleLockControls(false) }} className='p-1 px-2 cursor-pointer hover:bg-emerald-50 border border-emerald-600 w-full rounded text-center'>No</div>
            </div>
        </div>
    )
}

export default LockControls