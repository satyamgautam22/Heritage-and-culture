import React from "react";
const GalleryHeader = ({ total }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-[#2E1B0F]">
          Community Heritage Gallery
        </h2>

        <p className="mt-2 text-sm md:text-base text-[#5C4330]">
          Photos shared by explorers with love,
          history, culture and stories.
        </p>
      </div>

      <span className="text-xs font-semibold px-4 py-2 rounded-full bg-white border">
        Total Uploads: {total}
      </span>
    </div>
  );
};

export default GalleryHeader;