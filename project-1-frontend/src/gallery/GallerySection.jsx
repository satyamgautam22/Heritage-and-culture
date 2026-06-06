import React, { useState } from "react";
import axios from "axios";

import GalleryHeader from "./GalleryHeader";
import CategoryFilter from "./CategoryFilter";
import GalleryCard from "./GalleryCard";
import GalleryLoader from "./GalleryLoader";
import EmptyGallery from "./EmptyGallery";

import { useGallery } from "../hooks/useGallery";

const GallerySection = () => {
  const {
    photos,
    loading,
    fetchGallery,
  } = useGallery();

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const categories = [
    "All",
    ...new Set(
      photos
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  const filteredPhotos =
    selectedCategory === "All"
      ? photos
      : photos.filter(
          (item) =>
            item.category ===
            selectedCategory
        );

  const handleLike = async (id) => {
    const token =
      localStorage.getItem("token");

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/projects/${id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchGallery();
  };

  return (
    <section className="py-12">
      <GalleryHeader
        total={photos.length}
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={
          selectedCategory
        }
        setSelectedCategory={
          setSelectedCategory
        }
      />

      {loading && <GalleryLoader />}

      {!loading &&
        filteredPhotos.length === 0 && (
          <EmptyGallery />
        )}

      <div className="grid gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {filteredPhotos.map((item) => (
          <GalleryCard
            key={item._id}
            item={item}
            handleLike={handleLike}
          />
        ))}
      </div>
    </section>
  );
};

export default GallerySection;