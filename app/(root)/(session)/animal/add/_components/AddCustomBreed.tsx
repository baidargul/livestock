import Button from '@/components/ui/Button'
import Textbox from '@/components/ui/Textbox'
import { useDialog } from '@/hooks/useDialog'
import React, { useEffect, useState } from 'react'

type Props = {
    animal: any
    setAnimal: any
    setIsCustom: any
}

const AddCustomBreed = (props: Props) => {
    const [value, setValue] = useState("")

    useEffect(() => {
        setValue(props.animal.breed ?? "")
    }, [props.animal])

    const dialog = useDialog()

    const handleAddCustomBreed = () => {
        props.setAnimal((prev: any) => ({ ...prev, breed: String(value).toLocaleLowerCase() }))
        props.setIsCustom(true)
        dialog.closeDialog()
    }

    const handleClose = () => {
        dialog.closeDialog()
    }

    return (
        <div className='px-4 flex flex-col gap-2'>
            <div>Add your custom breed</div>
            <Textbox onChange={(val: string) => setValue(val)} value={value} />
            <div className='flex justify-between items-center w-full mt-2'>
                <Button disabled={String(value ?? "").length === 0} onClick={handleAddCustomBreed}>Add breed</Button>
                <Button onClick={handleClose} variant={'btn-secondary'}>Cancel</Button>
            </div>
        </div>
    )
}

export default AddCustomBreed