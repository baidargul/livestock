'use client'
import React, { useEffect, useState } from 'react'

type Props = {
    src: string
    controls?: boolean
    autoPlay?: boolean
    muted?: boolean
    suggestedVideos?: boolean
    loop?: boolean
    className?: string
}

const YoutubeVideoPlayer = (props: Props) => {
    const [src, setSrc] = useState({ iframe: '', videoId: '' });

    useEffect(() => {
        setSrc(convertToIFrameURL(props.src))
    }, [props.src])


    const convertToIFrameURL = (link: string) => {
        const videoId = link.split('v=')[1];
        return { iframe: `https://www.youtube.com/embed/${videoId}`, videoId: videoId }
    }

    return (
        <>
            <style>
                {
                    `.frame-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */  
    padding-top: 25px;
    width: 300%; /* enlarge beyond browser width */
    left: -100%; /* center */
}

.frame-container iframe {
    position: absolute; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;

    .youtube-video-wrapper {
   overflow: hidden;
   max-width: 100%;
}
}`
                }
            </style>
            <div className={`youtube-video-wrapper ${props.className}`}>
                <div className="frame-container pointer-events-none">
                    <iframe
                        width="100%"
                        height="315"
                        src={`${src.iframe}?controls=${props.controls ? '1' : '0'}&autoplay=${props.autoPlay ? '1' : '0'}&mute=${props.muted ? '1' : '0'}&modestbranding=1&rel=${props.suggestedVideos ? '1' : '0'}${props.loop ? `&loop=1&playlist=${src.videoId}` : ''}`}
                        title="Janwar Markaz"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </div>
            </div>
        </>
    )
}

export default YoutubeVideoPlayer