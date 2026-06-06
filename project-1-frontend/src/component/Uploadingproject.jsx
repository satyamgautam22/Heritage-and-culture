import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;

const Uploadingproject = () => {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ title: "", description: "", imageUrl: "" , category: ""});
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const resetForm = () => {
    setForm({ title: "", description: "", imageUrl: "" , category: ""});
    setSelectedImage(null);
    setPreview(null);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/projects");
      setProjects(res.data?.projects || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return null;
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setUploadingImage(true);
      const res = await axios.post("/data/uploadimage", formData, {
        headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data.imageUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = form.imageUrl;

      if (!selectedImage && !imageUrl) {
        toast.error("Please upload an image for the project");
        setSaving(false);
        return;
      }

      if (selectedImage) {
        const uploadedUrl = await handleImageUpload();
        if (!uploadedUrl) {
          toast.error("Image upload failed, project not saved");
          setSaving(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      if (editingId) {
        await axios.put(`/projects/${editingId}`, { ...form, imageUrl } ,{headers: {Authorization: `Bearer ${localStorage.getItem("token")}` }});
        toast.success("Project updated");
      } else {
        await axios.post("/projects", { ...form, imageUrl }, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}` }});
        toast.success("Project added");
      }

      resetForm();
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    const toastId = toast.loading("Deleting…");
    try {
      await axios.delete(`/projects/${id}`);
      toast.success("Deleted", { id: toastId });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project", {
        id: toastId,
      });
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title || "",
      description: project.description || "",
      imageUrl: project.imageUrl || "",
      category: project.category || "",
    });
    setEditingId(project._id);
    setPreview(project.imageUrl || null);
    setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    resetForm();
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
            {editingId ? "Edit Project" : "Add New Project"}
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Upload your latest work with a clean title, description and image.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl p-6 sm:p-8 mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              {editingId ? "Update Project Details" : "Create a New Project"}
            </h3>

            {editingId && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                Editing Mode
              </span>
            )}
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Project Title
              </label>
              <input
                className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 rounded-xl w-full transition"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Eg: Heritage Tourism Web App"
                required
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Project Description
            </label>
            <textarea
              className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 rounded-xl w-full resize-none transition"
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write a short description about your project..."
              required
            />
          </div>
          <div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-gray-700">
    Category
  </label>

  <select
    name="category"
    value={form.category}
    onChange={handleChange}
    required
    className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 rounded-xl w-full transition"
  >
    <option value="">Select Category</option>

    <option value="Monuments">
      Monuments
    </option>

    <option value="Festivals">
      Festivals
    </option>

    <option value="Cuisine">
      Cuisine
    </option>

    <option value="Arts & Crafts">
      Arts & Crafts
    </option>

    <option value="Architecture">
      Architecture
    </option>

    <option value="Traditions">
      Traditions
    </option>

    <option value="Temples">
      Temples
    </option>

    <option value="Forts">
      Forts
    </option>

    <option value="Museums">
      Museums
    </option>
  </select>
</div>

          {/* Image Upload Section */}
          <div className="mt-6 flex flex-col lg:flex-row lg:items-center gap-5">
            {/* Upload button */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Upload Project Image
              </label>

              <div className="flex items-center justify-between gap-3 border border-dashed border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm w-full"
                />

                {selectedImage && (
                  <span className="text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-lg border">
                    Selected ✅
                  </span>
                )}
              </div>

              {uploadingImage && (
                <p className="text-sm text-gray-500 mt-2">Uploading image…</p>
              )}
            </div>

            {/* Preview */}
            <div className="w-full lg:w-[220px]">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Preview
              </label>

              <div className="h-40 w-full rounded-2xl border bg-white overflow-hidden shadow-sm flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <p className="text-xs text-gray-400 text-center px-3">
                    No image selected yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row gap-4 items-center">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="w-full sm:w-auto bg-blue-600 disabled:opacity-60 text-white px-7 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
            >
              {saving ? "Saving..." : editingId ? "Update Project" : "Add Project"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full sm:w-auto px-7 py-3 rounded-xl font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* Project List Section */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">All Projects</h3>
          <span className="text-sm text-gray-600">
            Total: <b>{projects.length}</b>
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Loading projects…
            </p>
          ) : projects.length > 0 ? (
            projects.map((p) => (
              <div
                key={p._id}
                className="group bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition"
              >
                <div className="relative">
                  <img
                    src={p.imageUrl || "/no-image.png"}
                    alt={p.title || "No Image"}
                    onError={(e) => (e.currentTarget.src = "/no-image.png")}
                    className="object-cover h-52 w-full group-hover:scale-[1.02] transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {p.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {p.description}
                  </p>

                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex-1 bg-yellow-500 text-white px-3 py-2.5 rounded-xl hover:bg-yellow-600 text-sm font-semibold transition shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2.5 rounded-xl hover:bg-red-700 text-sm font-semibold transition shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white border border-gray-200 rounded-2xl p-10 shadow-sm text-center">
              <p className="text-gray-600 font-medium">No projects available.</p>
              <p className="text-gray-400 text-sm mt-2">
                Add your first project using the form above 👆
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Uploadingproject;
