import React, { useRef, useState } from 'react'

type Props = {
    children: React.ReactNode
    limit?: number
    onChange?: (files: File[]) => void
}

const ImageUploadWrapper = (props: Props) => {
    const txtRef: any = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if (txtRef.current) {
            txtRef.current.click()
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files)
            if (props.limit && selectedFiles.length > props.limit) {
                alert(`You can only upload ${props.limit} files only`)
                return
            }
            if (props.onChange) {
                props.onChange(selectedFiles)
            }
        }
        if (txtRef.current) {
            txtRef.current.value = ''
        }
    }

    return (
        <div onClick={handleClick} >
            <input ref={txtRef} onChange={handleChange} type="file" accept="image/*" multiple className='hidden' id='image-upload' />
            <div>{props.children}</div>
        </div>
    )
}

export default ImageUploadWrapper