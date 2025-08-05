import React from 'react'
import Marquee from 'react-fast-marquee'

type Props = {}

const AnimalMarquee = (props: Props) => {
    return (
        <div>
            <Marquee autoFill={true} speed={20} pauseOnHover={true}>
                <div>Animals</div>
                <div>Animals</div>
                <div>Animals</div>
                <div>Animals</div>
            </Marquee>
        </div>
    )
}

export default AnimalMarquee