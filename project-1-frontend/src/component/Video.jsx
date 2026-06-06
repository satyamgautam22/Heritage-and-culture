import React, { useState } from "react";

const AddVideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedVideo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedVideo) return alert("Please select a video first");

    const formData = new FormData();
    formData.append("video", selectedVideo);

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/data/uploadvideo`, // ✅ removed extra slash
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUploadedUrl(data.videoUrl); // ✅ match backend response
        alert("Video uploaded successfully!");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold">Add Video</h2>

      {/* File input */}
      <input type="file" accept="video/*" onChange={handleFileChange} />

      {/* Video Preview */}
      {preview && (
        <video
          src={preview}
          controls
          className="h-40 w-full object-cover mt-2 rounded"
        />
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`bg-blue-500 text-white px-4 py-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {loading ? "Uploading..." : "Upload Video"}
      </button>

      {/* Uploaded video link */}
      {uploadedUrl && (
        <div className="mt-4">
          <p className="font-semibold">Uploaded Video URL:</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {uploadedUrl}
          </a>
          <video
            src={uploadedUrl}
            controls
            className="h-40 w-full object-cover mt-2 rounded"
          />
        </div>
      )}
    </div>
  );
};

export default AddVideoSection;
