// src/components/Banner.jsx
import React, { useState, useEffect } from "react";

const Banner = () => {
  const images = [
    "https://picsum.photos/id/1018/1600/500",
    "https://picsum.photos/id/1025/1600/500",
    "https://picsum.photos/id/1039/1600/500",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Banner ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Optional: Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Banner;
