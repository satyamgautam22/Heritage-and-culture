import React, { useState, useEffect } from "react";

const AddImageSection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

 const handleUpload = async () => {
  if (!selectedImage) return alert("Please select an image first");

  const formData = new FormData();
  formData.append("image", selectedImage); // ✅ must match backend multer field

  try {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/data/uploadimage`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setUploadedUrl(data.imageUrl); // ✅ backend should return imageUrl
      alert("Image uploaded successfully!");
    } else {
      alert(data.message || "Upload failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error uploading image");
  } finally {
    setLoading(false);
  }
};

  // ✅ Cleanup preview URL when unmounted or new file selected
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold">Add Image</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="h-32 w-32 object-cover mt-2 rounded"
        />
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`bg-blue-500 text-white px-4 py-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {uploadedUrl && (
        <div className="mt-4">
          <p className="font-semibold">Uploaded Image URL:</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline break-all"
          >
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default AddImageSection;
