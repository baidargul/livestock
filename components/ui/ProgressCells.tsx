import React from 'react'

type Props = {
    value: number
    max: number
    className?: string
}

const ProgressCells = (props: Props) => {
    return (
        <div className={`flex gap-0 w-full ${props.className}`}>
            {
                Array.from({ length: props.max }).map((_, index) => {
                    return (
                        <div key={index} className={`relative flex items-center ${index <= props.value - 1 && index !== props.max - 1 ? "w-full" : ""}`}>
                            {index < props.max - 1 && <div className={`absolute transition-all duration-600 ease-in-out left-1 w-full h-3 ${index <= props.value - 1 ? 'bg-emerald-600' : 'bg-zinc-300'} `}></div>}
                            <div className={`w-6 h-6 transition-all duration-600 ease-in-out rounded-full ${index <= props.value - 1 ? 'bg-emerald-600' : "bg-zinc-300"} overflow-hidden relative flex justify-center items-center`} style={{ boxShadow: index <= props.value - 1 ? "" : "" }}>
                                <div className={`absolute w-4 h-4 rounded-full transition-all duration-600 ease-in-out ${index <= props.value - 1 ? "bg-emerald-100" : "bg-zinc-300"} `} style={{ boxShadow: index <= props.value - 1 ? "0px 0px 105px 45px rgba(45, 255, 196, 0.9)" : '' }}></div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ProgressCells