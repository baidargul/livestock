import Button from '@/components/ui/Button'
import axios from 'axios'
import React from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
}

const PostPreview = (props: Props) => {


    const handleHitApi = async () => {
        const data = {
            ...props.animal,
        }
        const response = await axios.post(`/api/post`, data)
        console.log(response)
    }

    return (
        <div>
            <div className='flex items-center justify-between gap-4 w-full p-4'>
                <Button onClick={props.moveBack} className='w-full' variant='btn-secondary'>Back</Button>
                <Button onClick={handleHitApi} className='w-full' disabled={props.animal?.breed && props.animal?.breed !== "" ? false : true}>{props.animal?.breed && props.animal?.breed !== "" ? `Next` : "Select"}</Button>
            </div>
        </div>
    )
}

export default PostPreview