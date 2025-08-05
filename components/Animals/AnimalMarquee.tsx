import React from 'react'
import Marquee from 'react-fast-marquee'

type Props = {}

const AnimalMarquee = (props: Props) => {
    return (
        <div>
            <Marquee>
                <div>Animals</div>
                <div>Animals</div>
                <div>Animals</div>
                <div>Animals</div>
            </Marquee>
        </div>
    )
}

export default AnimalMarquee