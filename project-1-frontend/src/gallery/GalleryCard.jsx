import { Heart } from "lucide-react";
import React from "react";
const GalleryCard = ({
  item,
  handleLike,
}) => {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border shadow-sm">
      <div className="relative h-60 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5 space-y-3">
        <h3 className="font-bold text-lg">
          {item.title}
        </h3>

        <span className="px-3 py-1 bg-amber-100 rounded-full text-xs">
          {item.category}
        </span>

        <p>
          Uploaded by:{" "}
          {item.uploaderName}
        </p>

        <button
          onClick={() =>
            handleLike(item._id)
          }
          className="flex items-center gap-2 text-red-500"
        >
          <Heart size={18} />
          {item.likedBy?.length || 0}
        </button>
      </div>
    </article>
  );
};

export default GalleryCard;