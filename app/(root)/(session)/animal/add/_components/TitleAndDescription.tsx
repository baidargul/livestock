import React from 'react'

type Props = {
    moveNext: () => void
    moveBack: () => void
    setAnimal: (animal: any) => void
    animal: any
}

const TitleAndDescription = (props: Props) => {
    return (
        <div>TitleAndDescription</div>
    )
}

export default TitleAndDescription