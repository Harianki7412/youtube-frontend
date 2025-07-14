// youtube-clone-frontend/src/pages/ChannelPage.jsx
// Page to display a user's channel, their videos, and options to manage them.
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CustomAlertDialog from '../components/CustomAlertDialog';
import { useAuth } from '../context/AuthContext';

function ChannelPage() {
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const [isSubscribed, setIsSubscribed] = useState(false);

  const isOwner = user && channel && user._id === channel.owner._id;

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        setError(null);

        const channelResponse = await api.get(`/channels/${channelId}`);
        setChannel(channelResponse.data);

        const videosResponse = await api.get(`/channels/${channelId}/videos`);
        setChannelVideos(videosResponse.data);

        if (user && user._id && channelResponse.data.owner._id !== user._id) {
          const subscriptionStatusResponse = await api.get(`/subscriptions/${channelId}/status`);
          setIsSubscribed(subscriptionStatusResponse.data.isSubscribed);
        } else if (user && user._id && channelResponse.data.owner._id === user._id) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }

      } catch (err) {
        console.error("Error fetching channel data:", err);
        setError(err.response?.data?.message || "Failed to load channel. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [channelId, user]);

  const handleSubscribeToggle = async () => {
    if (!user) {
      setAlertDialogMessage("Please sign in to subscribe to channels.");
      setShowAlertDialog(true);
      return;
    }
    if (!channel) return;
    try {
      if (isSubscribed) {
        await api.delete(`/subscriptions/${channelId}/unsubscribe`);
        setIsSubscribed(false);
        setChannel(prevChannel => ({ ...prevChannel, subscribers: Math.max(0, prevChannel.subscribers - 1) }));
        setAlertDialogMessage(`Unsubscribed from ${channel.channelName}.`);
      } else {
        await api.post(`/subscriptions/${channelId}/subscribe`);
        setIsSubscribed(true);
        setChannel(prevChannel => ({ ...prevChannel, subscribers: prevChannel.subscribers + 1 }));
        setAlertDialogMessage(`Subscribed to ${channel.channelName}!`);
      }
      setShowAlertDialog(true);
      refreshUserProfile();
    } catch (err) {
      console.error("Subscription toggle failed:", err);
      setAlertDialogMessage(err.response?.data?.message || "Failed to change subscription status.");
      setShowAlertDialog(true);
    }
  };

  const handleDeleteVideoClick = (videoId) => {
    setConfirmDialogMessage("Are you sure you want to delete this video? This action cannot be undone.");
    setConfirmAction(() => async () => {
      try {
        await api.delete(`/videos/${videoId}`);
        setChannelVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
        setAlertDialogMessage("Video deleted successfully!");
        setShowAlertDialog(true);
      } catch (err) {
        console.error("Error deleting video:", err);
        setAlertDialogMessage(err.response?.data?.message || "Failed to delete video.");
        setShowAlertDialog(true);
      }
    });
    setShowConfirmDialog(true);
  };

  const handleEditVideo = (videoId) => {
    setAlertDialogMessage(`Functionality to edit video ID: ${videoId} needs to be implemented. You would navigate to an upload/edit form.`);
    setShowAlertDialog(true);
  };

  const handleAlertDialogConfirm = () => {
    setShowAlertDialog(false);
    setAlertDialogMessage('');
  };

  const handleConfirmDialogConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleConfirmDialogCancel = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 text-lg mt-8">{error}</div>;
  if (!channel) return <div className="text-center text-gray-400 text-lg mt-8">Channel not found.</div>;

  return (
    <div className="channel-page p-4 md:p-8 text-white">
      <div
        className="channel-banner w-full h-32 md:h-48 lg:h-64 bg-cover bg-center rounded-lg mb-6 shadow-lg"
        style={{ backgroundImage: `url(${channel.channelBanner || 'https://placehold.co/1200x200/2d3748/e2e8f0?text=Channel+Banner'})` }}
      ></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-end mb-4 md:mb-0">
          <img
            src={channel.channelAvatar || 'https://placehold.co/100/2d3748/e2e8f0?text=Logo'}
            alt={`${channel.channelName} Avatar`}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full md:mr-6 mb-4 md:mb-0 border-2 border-gray-600 shadow-md"
          />
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold">{channel.channelName}</h1>
            <p className="text-gray-400 text-sm md:text-base">{channel.subscribers} subscribers</p>
            <p className="text-gray-300 mt-2 text-xs md:text-sm max-w-sm">{channel.description || 'No description provided.'}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto mt-4 md:mt-0">
          {isOwner ? (
            <>
              <Link to="/create-video" state={{ channelData: channel }} className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors duration-200 shadow-md text-center">
                Upload Video
              </Link>
              <button onClick={() => {
                setAlertDialogMessage("Channel settings/edit functionality needs to be implemented. This would allow you to change channel name, description, banner, etc.");
                setShowAlertDialog(true);
              }}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200 shadow-md text-center">
                Edit Channel
              </button>
            </>
          ) : (
            <button
              onClick={handleSubscribeToggle}
              className={`w-full sm:w-auto py-2 px-4 rounded-md font-semibold transition-colors duration-200 shadow-md text-center ${isSubscribed ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>
      </div>

      <hr className="border-gray-700 my-6" />

      <h2 className="text-xl md:text-2xl font-bold mb-4">Videos</h2>

      {channelVideos.length === 0 ? (
        <p className="text-gray-400 text-center text-sm md:text-base">This channel has no videos yet.</p>
      ) : (
        <div className="video-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {channelVideos.map((video) => (
            <div key={video._id} className="relative group">
              <VideoCard video={video} />
              {isOwner && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => { e.preventDefault(); handleEditVideo(video._id); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full text-xs shadow-md"
                    title="Edit Video"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); handleDeleteVideoClick(video._id); }}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full text-xs shadow-md"
                    title="Delete Video"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CustomAlertDialog
        isOpen={showAlertDialog}
        message={alertDialogMessage}
        onConfirm={handleAlertDialogConfirm}
        showCancelButton={false}
      />

      <CustomAlertDialog
        isOpen={showConfirmDialog}
        message={confirmDialogMessage}
        onConfirm={handleConfirmDialogConfirm}
        onCancel={handleConfirmDialogCancel}
        showCancelButton={true}
      />
    </div>
  );
}

export default ChannelPage;