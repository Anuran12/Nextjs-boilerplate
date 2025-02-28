"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  title: string;
  imageUrl: string | StaticImageData;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, imageUrl }) => {
  return (
    <Link
      href="#"
      className="block rounded-lg overflow-hidden relative transition-transform duration-300 hover:scale-105"
    >
      <div className="relative aspect-[4/3] bg-gray-800">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          onError={(e) => {
            // Hide the image on error
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>
      <div className="absolute bottom-0 w-full bg-black bg-opacity-50 py-2 px-2 md:py-3 md:px-3">
        <p className="text-white text-center text-xs sm:text-sm md:text-base font-bold">
          {title}
        </p>
      </div>
    </Link>
  );
};

export default ServiceCard;
