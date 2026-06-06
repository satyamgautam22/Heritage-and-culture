import React from "react";
const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() =>
            setSelectedCategory(category)
          }
          className={`px-5 py-2 rounded-full ${
            selectedCategory === category
              ? "bg-amber-600 text-white"
              : "bg-white border"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;