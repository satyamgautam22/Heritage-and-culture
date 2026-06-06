import { useEffect, useState } from "react";
import axios from "axios";

export const useGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects`
      );

      setPhotos(res.data.projects || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchGallery();
      setLoading(false);
    };

    load();
  }, []);

  return {
    photos,
    loading,
    fetchGallery,
  };
};