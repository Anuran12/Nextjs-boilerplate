"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";

interface UserProfileProps {
  name: string;
  vehicle: string;
  vehicleId: string;
  imageUrl: string | StaticImageData;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  vehicle,
  vehicleId,
  imageUrl,
}) => {
  return (
    <div className="flex items-center gap-4 py-5 md:py-6 lg:py-8">
      <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gray-300">
        {/* Fallback avatar if image fails to load */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xl md:text-2xl lg:text-3xl">
          {name.charAt(0)}
        </div>

        {/* User profile image */}
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          onError={(e) => {
            // Hide the image on error, showing the fallback
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>

      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
          {name}
        </h2>
        <p className="text-sm md:text-base lg:text-lg">{vehicle}</p>
        <p className="text-xs md:text-sm text-yellow-500">{vehicleId}</p>
      </div>
    </div>
  );
};

export default UserProfile;
