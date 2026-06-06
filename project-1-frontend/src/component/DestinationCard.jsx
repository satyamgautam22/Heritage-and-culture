import React from "react";

export default function DestinationCard({ destination }) {
  const images = destination.images || [];

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

      {/* MAIN IMAGE */}
      <div className="relative h-48">
        <img
          src={images[0]}
          alt={destination.name}
          className="w-full h-full object-cover"
        />

        {/* Category */}
        <span className="absolute top-2 left-2 bg-white px-3 py-1 text-xs rounded-full shadow">
          {destination.category}
        </span>

        {/* Price */}
        <span className="absolute bottom-2 right-2 bg-black text-white px-3 py-1 text-xs rounded-full">
          {destination.priceRange}
        </span>
      </div>

      {/* THUMBNAILS (CLUBBED IMAGES) */}
      {images.length > 1 && (
        <div className="flex gap-2 p-2 overflow-x-auto">
          {images.slice(0, 4).map((img, index) => (
            <img
              key={index}
              src={img}
              alt="thumb"
              className="w-16 h-16 object-cover rounded-md"
            />
          ))}

          {/* Show +more */}
          {images.length > 4 && (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md text-sm">
              +{images.length - 4}
            </div>
          )}
        </div>
      )}

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-lg">
          {destination.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          📍 {destination.location.city}, {destination.location.state}
        </p>
      </div>
    </div>
  );
}