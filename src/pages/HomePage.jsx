import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import FilterButtons from "../components/FilterButtons";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const location = useLocation();

  const categories = [
    "All",
    "React",
    "JavaScript",
    "Node.js",
    "MongoDB",
    "Gaming",
    "Music",
    "News",
    "Education",
    "Sports",
    "Entertainment",
    "Technology",
    "General",
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get("search");

        const params = {};
        if (activeCategory && activeCategory !== "All") {
          params.category = activeCategory;
        }
        if (searchTerm) {
          params.search = searchTerm;
        }

        const response = await api.get("/videos", { params });
        setVideos(response.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load videos. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [activeCategory, location.search]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center text-red-500 text-lg md:text-xl mt-8">
        Error: {error}
      </div>
    );
  if (videos.length === 0)
    return (
      <div className="text-center text-gray-400 text-lg md:text-xl mt-8">
        No videos found matching your criteria.
      </div>
    );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-gray-900 text-white">
      <div className="mb-6">
        <FilterButtons
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      <div className="video-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
