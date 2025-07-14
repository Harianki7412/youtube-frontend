// Page to display a selected video, its details, and comments.
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import CommentSection from "../components/CommentSection";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomAlertDialog from "../components/CustomAlertDialog";
import { useAuth } from "../context/AuthContext";

function VideoPlayerPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const { user, refreshUserProfile } = useAuth();

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState("");

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const fetchVideoAndComments = async () => {
      try {
        setLoading(true);
        setError(null);

        const videoResponse = await api.get(`/videos/${videoId}`);
        setVideo(videoResponse.data);

        if (videoResponse.data.channel && videoResponse.data.channel._id) {
          const channelResponse = await api.get(
            `/channels/${videoResponse.data.channel._id}`
          );
          setChannel(channelResponse.data);

          if (user && user._id) {
            if (videoResponse.data.channel.owner === user._id) {
              setIsSubscribed(true);
            } else {
              try {
                const subscriptionStatusResponse = await api.get(
                  `/subscriptions/${videoResponse.data.channel._id}/status`
                );
                setIsSubscribed(subscriptionStatusResponse.data.isSubscribed);
              } catch (subError) {
                console.error(
                  "Error fetching initial subscription status:",
                  subError
                );
                setIsSubscribed(false);
              }
            }
          } else {
            setIsSubscribed(false);
          }
        } else {
          setChannel(null);
          setIsSubscribed(false);
        }

        if (!user || videoResponse.data.uploader._id !== user._id) {
          await api.put(`/videos/${videoId}/view`);
          setVideo((prevVideo) => ({
            ...prevVideo,
            views: (prevVideo.views || 0) + 1,
          }));
        }

        const commentsResponse = await api.get(`/comments/${videoId}`);
        setComments(commentsResponse.data);
      } catch (err) {
        console.error("Error fetching video or comments:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load video or comments. Please try again."
        );
        setAlertDialogMessage(
          err.response?.data?.message ||
            "Error loading video. It might not exist."
        );
        setShowAlertDialog(true);
        if (err.response && err.response.status === 404) {
          setTimeout(() => navigate("/"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideoAndComments();
  }, [videoId, user, navigate]);

  const handleAddComment = async (commentText) => {
    if (!user) {
      setAlertDialogMessage("Please sign in to add comments.");
      setShowAlertDialog(true);
      return;
    }
    try {
      const response = await api.post(`/comments/${videoId}`, {
        text: commentText,
      });
      setComments((prevComments) => [response.data, ...prevComments]);
    } catch (err) {
      console.error("Error adding comment:", err);
      setAlertDialogMessage(
        err.response?.data?.message || "Failed to add comment."
      );
      setShowAlertDialog(true);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    if (!user) {
      setAlertDialogMessage("Please sign in to edit comments.");
      setShowAlertDialog(true);
      return;
    }
    try {
      const response = await api.put(`/comments/${commentId}`, {
        text: newText,
      });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, text: newText } : comment
        )
      );
      setAlertDialogMessage("Comment updated successfully!");
      setShowAlertDialog(true);
    } catch (err) {
      console.error("Error editing comment:", err);
      setAlertDialogMessage(
        err.response?.data?.message || "Failed to edit comment."
      );
      setShowAlertDialog(true);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      setAlertDialogMessage("Please sign in to delete comments.");
      setShowAlertDialog(true);
      return;
    }
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
      setAlertDialogMessage("Comment deleted successfully!");
      setShowAlertDialog(true);
    } catch (err) {
      console.error("Error deleting comment:", err);
      setAlertDialogMessage(
        err.response?.data?.message || "Failed to delete comment."
      );
      setShowAlertDialog(true);
    }
  };

  const handleLike = async () => {
    if (!user) {
      setAlertDialogMessage("Please sign in to like videos.");
      setShowAlertDialog(true);
      return;
    }
    try {
      const response = await api.put(`/videos/${videoId}/like`);
      setVideo((prevVideo) => ({
        ...prevVideo,
        likes: response.data.likes,
        dislikes: response.data.dislikes,
      }));
    } catch (err) {
      console.error("Error liking video:", err);
      setAlertDialogMessage(
        err.response?.data?.message || "Failed to like video."
      );
      setShowAlertDialog(true);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      setAlertDialogMessage("Please sign in to dislike videos.");
      setShowAlertDialog(true);
      return;
    }
    try {
      const response = await api.put(`/videos/${videoId}/dislike`);
      setVideo((prevVideo) => ({
        ...prevVideo,
        likes: response.data.likes,
        dislikes: response.data.dislikes,
      }));
    } catch (err) {
      console.error("Error disliking video:", err);
      setAlertDialogMessage(
        err.response?.data?.message || "Failed to dislike video."
      );
      setShowAlertDialog(true);
    }
  };

  const handleSubscribeToggle = async () => {
    if (!channel || !channel._id) {
      console.error(
        "Channel data or channel ID not available for subscription toggle."
      );
      setAlertDialogMessage(
        "Channel information is not loaded yet. Please try again."
      );
      setShowAlertDialog(true);
      return;
    }

    const channelId = channel._id;

    if (!user) {
      setAlertDialogMessage("You must be logged in to subscribe to channels.");
      setShowAlertDialog(true);
      return;
    }

    try {
      let response;
      if (isSubscribed) {
        response = await api.delete(`/subscriptions/${channelId}/unsubscribe`);
      } else {
        response = await api.post(`/subscriptions/${channelId}/subscribe`);
      }

      setIsSubscribed(response.data.isSubscribed);
      setChannel((prevChannel) => ({
        ...prevChannel,
        subscribers: response.data.subscriberCount,
      }));

      setAlertDialogMessage(response.data.message);
      setShowAlertDialog(true);

      refreshUserProfile();
    } catch (err) {
      console.error("Subscription toggle failed:", err);
      setAlertDialogMessage(
        err.response?.data?.message || "Failed to change subscription status."
      );
      setShowAlertDialog(true);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center text-red-500 text-lg mt-8">{error}</div>;
  if (!video || !channel)
    return (
      <div className="text-center text-gray-400 text-lg mt-8">
        Video or channel data not found.
      </div>
    );

  const isChannelOwner = user && channel && channel.owner === user._id;

  return (
    <div className="video-player-page p-4 md:p-8 lg:flex lg:gap-8 text-white">
      <div className="main-video-section lg:flex-grow">
        <div className="video-player-container aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow-lg">
          <video
            controls
            src={video.videoUrl}
            title={video.title}
            className="w-full h-full"
            poster={video.thumbnailUrl}
            onError={(e) => {
              console.error("Video playback error:", e);
              setAlertDialogMessage(
                "Failed to load video. The video URL might be invalid or not accessible."
              );
              setShowAlertDialog(true);
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <h1 className="text-xl md:text-3xl font-bold mb-2">{video.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 flex-wrap gap-y-4">
          <div className="flex items-center">
            <Link to={`/channel/${channel._id}`} className="flex items-center">
              <img
                src={
                  channel.profilePicture ||
                  "https://placehold.co/50x50/000000/FFFFFF?text=C"
                }
                alt={`${channel.channelName} Avatar`}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 border border-gray-700"
              />
              <div>
                <p className="text-gray-300 font-semibold hover:underline text-sm md:text-base">
                  {channel.channelName || video.uploader?.username}
                </p>
                <p className="text-gray-400 text-xs md:text-sm">
                  {channel.subscribers ? channel.subscribers.length : 0}{" "}
                  subscribers
                </p>
              </div>
            </Link>
            {!isChannelOwner && (
              <button
                onClick={handleSubscribeToggle}
                className={`ml-4 py-2 px-4 rounded-md font-semibold text-sm md:text-base transition-colors duration-200 ${
                  isSubscribed
                    ? "bg-gray-600 hover:bg-gray-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isSubscribed ? "subscribe" : "subscribe"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-4 mt-2 sm:mt-0">
            <button
              onClick={handleLike}
              className="flex items-center text-white bg-gray-700 hover:bg-gray-600 py-2 px-3 md:px-4 rounded-full transition-colors duration-200 text-sm md:text-base"
            >
              👍 {video.likes ? video.likes.length : 0}
            </button>
            <button
              onClick={handleDislike}
              className="flex items-center text-white bg-gray-700 hover:bg-gray-600 py-2 px-3 md:px-4 rounded-full transition-colors duration-200 text-sm md:text-base"
            >
              👎 {video.dislikes ? video.dislikes.length : 0}
            </button>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg mb-6 shadow-inner">
          <h3 className="text-white font-semibold mb-2 text-base md:text-lg">
            Description
          </h3>
          <p className="text-gray-300 text-sm whitespace-pre-wrap">
            {video.description || "No description provided."}
          </p>
        </div>

        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          currentUser={user}
        />
      </div>

      <CustomAlertDialog
        isOpen={showAlertDialog}
        message={alertDialogMessage}
        onConfirm={() => setShowAlertDialog(false)}
        showCancelButton={false}
      />
    </div>
  );
}

export default VideoPlayerPage;
