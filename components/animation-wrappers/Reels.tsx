"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type ReelProps = {
  gap?: number;
  direction?: "vertical" | "horizontal";
  invert?: boolean;
  speed?: number; // Speed in pixels per frame
  fps?: number; // Frames per second
  images?: ReelImageType[] | any[];
  className?: string;
  directObject?: boolean
};

export type ReelImageType = {
  image: string;
  alt: string;
  linK?: string;
  title?: string;
  description?: string;
};

const Reels = ({
  gap = 12,
  direction = "vertical",
  invert = false,
  speed = 1,
  fps = 60,
  images = [
    { image: `/carousels/01.avif`, alt: "Image 1" },
    { image: `/carousels/01.avif`, alt: "Image 2" },
    { image: `/carousels/01.avif`, alt: "Image 3" },
    { image: `/carousels/01.avif`, alt: "Image 4" },
  ],
  className = "",
  directObject = false,
}: ReelProps) => {
  const reelRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState(0);

  const addImages = () => {
    const newImages = [...images];
    return newImages;
  };

  // Ensure seamless scrolling
  useEffect(() => {
    if (!isHovered && !dragging) {
      const interval = setInterval(() => {
        if (reelRef.current) {
          const scrollAmount = invert ? -speed : speed;

          if (direction === "vertical") {
            reelRef.current.scrollTop += scrollAmount;
            if (reelRef.current.scrollTop <= 0 && invert) {
              reelRef.current.scrollTop = reelRef.current.scrollHeight / 2;
              try {
                images.unshift(...addImages());
              } catch (error) {

              }
            } else if (
              reelRef.current.scrollTop >= reelRef.current.scrollHeight / 2 &&
              !invert
            ) {
              try {
                reelRef.current.scrollTop = 0; // Reset scroll
                images.unshift(...addImages());
              } catch (error) {
              }
            }
          } else {
            reelRef.current.scrollLeft += scrollAmount;
            if (reelRef.current.scrollLeft <= 0 && invert) {
              reelRef.current.scrollLeft = reelRef.current.scrollWidth / 2;
              images.unshift(...addImages());
            } else if (
              reelRef.current.scrollLeft >= reelRef.current.scrollWidth / 2 &&
              !invert
            ) {
              reelRef.current.scrollLeft = 0; // Reset scroll
              images.unshift(...addImages());
            }
          }
        }
      }, 1000 / fps);

      return () => clearInterval(interval);
    }
  }, [isHovered, dragging, direction, invert, speed, fps, images]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset(direction === "vertical" ? e.clientY : e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && reelRef.current) {
      const delta = offset - (direction === "vertical" ? e.clientY : e.clientX);
      if (direction === "vertical") {
        reelRef.current.scrollTop += delta;
      } else {
        reelRef.current.scrollLeft += delta;
      }
      setOffset(direction === "vertical" ? e.clientY : e.clientX);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      ref={reelRef}
      className={`relative ${direction === "vertical" ? "h-full w-full" : "w-full h-full"
        } overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      <div
        className={`flex ${direction === "vertical" ? "flex-col" : "flex-row"}`}
        style={{
          gap: `${gap}px`,
          flexWrap: "nowrap",
        }}
      >
        {/* Render images twice for seamless looping */}
        {images
          .concat(images)
          .concat(images)
          .concat(images)
          .map((image: any, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {!directObject && <div className="relative">
                <Image
                  src={image.image}
                  width={200}
                  height={200}
                  className="rounded-xl select-none"
                  alt={image.alt}
                  draggable={false}
                />
                {image.title && image.title.length > 0 && (
                  <div className="absolute z-20 bottom-1 text-white flex justify-center items-center text-center w-full">
                    {image.title}
                  </div>
                )}
                {/* {image.description && image.description.length > 0 && (
                  <div className="absolute z-20 bottom-0 text-white">
                    {image.description}
                  </div>
                )} */}
                {image.title && image.title.length > 0 && (
                  <div className="w-full h-[40%] rounded-b-xl  absolute bottom-0 z-10 bg-gradient-to-t from-black/60 to-transparent"></div>
                )}
              </div>}
              {directObject && <div className="relative">
                {image}
              </div>}
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Reels;
