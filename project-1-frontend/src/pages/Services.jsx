import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // change if needed

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/projects/${id}`);
        setProject(res.data?.project || null);
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!project) return <p className="text-center mt-10">Project not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Home
      </Link>

      <img
        src={project.imageUrl || "/no-image.png"}
        alt={project.title}
        onError={(e) => (e.currentTarget.src = "/no-image.png")}
        className="w-full h-80 object-cover rounded-lg shadow mb-6"
      />
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-700 text-lg leading-relaxed">{project.description}</p>
    </div>
  );
};

export default ProjectDetails;
