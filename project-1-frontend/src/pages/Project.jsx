import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import React from "react";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects/${id}`);
        setProject(res.data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!project) return <p className="text-center mt-10">Project not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden p-8">
        
        {/* Title */}
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
          {project.title}
        </h1>

        {/* Image */}
        <div className="w-full mb-6">
          <img
            src={project.imageUrl || "/no-image.png"}
            alt={project.title}
            className="w-full h-80 object-cover rounded-lg shadow-md"
            onError={(e) => (e.currentTarget.src = "/no-image.png")}
          />
        </div>

        {/* Description */}
        {project.description && (
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              Project Description
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {project.description}
            </p>
          </div>
        )}
        

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
          <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
        </div>


        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
