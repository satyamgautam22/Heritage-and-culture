import React, { useState, useEffect } from "react";

export default function AddDestinationForm() {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    country: "India",
    category: "",
    priceRange: "",
    images: [],
  });

  const [preview, setPreview] = useState(null);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image (single)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, images: [file] });

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  // Cleanup preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length < 1) {
      alert("Please upload an image");
      return;
    }

    const data = new FormData();

    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("priceRange", formData.priceRange);

    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("country", formData.country);

    // single image
    data.append("images", formData.images[0]);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/destinations/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // remove if not using auth
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Error occurred");
        return;
      }

      alert("Destination Added Successfully");

      // reset
      setFormData({
        name: "",
        city: "",
        state: "",
        country: "India",
        category: "",
        priceRange: "",
        images: [],
      });

      setPreview(null);

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-5xl">

        <h2 className="text-3xl font-bold text-center mb-2">
          Add New Destination
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Upload details with image preview
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-6">

            {/* LEFT SIDE */}
            <div className="md:col-span-2 space-y-5">

              <input
                type="text"
                name="name"
                placeholder="Destination Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                />
              </div>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              >
                <option value="">Select Category</option>
                <option>Heritage</option>
                <option>Beach</option>
                <option>Hill Station</option>
                <option>Wildlife</option>
                <option>Religious</option>
                <option>Adventure</option>
                <option>City</option>
              </select>

              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              >
                <option value="">Select Price Range</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <div>
                <label className="block mb-2 font-medium">
                  Upload Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Add Destination
              </button>
            </div>

            {/* RIGHT SIDE PREVIEW */}
            <div>
              <p className="font-medium mb-2">Preview</p>

              <div className="border rounded-xl h-56 flex items-center justify-center bg-gray-50">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-full w-full object-cover rounded-xl"
                  />
                ) : (
                  <p className="text-gray-400 text-sm">
                    No image selected yet
                  </p>
                )}
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}