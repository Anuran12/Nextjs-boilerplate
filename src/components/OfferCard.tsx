"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface OfferCardProps {
  imageUrl: string | StaticImageData;
}

const OfferCard: React.FC<OfferCardProps> = ({ imageUrl }) => {
  return (
    <Link
      href="#"
      className="rounded-lg overflow-hidden aspect-square flex items-center justify-center relative transition-transform duration-300 hover:scale-105"
    >
      <div className="w-full h-full">
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt="Offer"
            fill
            className="object-cover"
            onError={(e) => {
              // Hide the image on error
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default OfferCard;
