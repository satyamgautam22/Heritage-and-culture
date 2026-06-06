import React, { useState } from "react";

const FileUploadSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Preview only for images
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }

    setMessage("");
    setUploadedUrl("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setIsError(true);
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileName", selectedFile.name);

    try {
      setLoading(true);
      setIsError(false);
      setMessage("");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/data/fileUpload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadedUrl(data.fileUrl); // ✅ match backend response
        setMessage("File uploaded successfully!");
        setIsError(false);
        setSelectedFile(null);
        setPreview(null);
      } else {
        setMessage(data.message || "Upload failed.");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while uploading.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold">Add File</h2>

      {/* ✅ accept fixed */}
      <input type="file" onChange={handleFileChange} />

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
        {loading ? "Uploading..." : "Upload File"}
      </button>

      {message && (
        <p className={`mt-2 ${isError ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      )}

      {uploadedUrl && (
        <div className="mt-4">
          <p className="font-semibold">Uploaded File URL:</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
