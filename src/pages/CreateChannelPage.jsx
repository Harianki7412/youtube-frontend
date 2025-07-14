import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CustomAlertDialog from '../components/CustomAlertDialog';
import LoadingSpinner from '../components/LoadingSpinner';

function CreateChannelPage() {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelBannerFile, setChannelBannerFile] = useState(null);
  const [channelAvatarFile, setChannelAvatarFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');

  const { user, refreshUserProfile } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.channelId) {
      navigate(`/channel/${user.channelId}`);
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [bannerPreview, avatarPreview]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChannelBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setChannelBannerFile(null);
      setBannerPreview('');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChannelAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setChannelAvatarFile(null);
      setAvatarPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!channelBannerFile || !channelAvatarFile) {
      const errorMessage = "Please upload both a channel banner and an avatar.";
      setError(errorMessage);
      setAlertDialogMessage(errorMessage);
      setShowAlertDialog(true);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('channelName', channelName);
      formData.append('description', description);
      formData.append('channelBanner', channelBannerFile);
      formData.append('channelAvatar', channelAvatarFile);

      const response = await api.post('/channels', formData);
      const newChannel = response.data;

      await refreshUserProfile();

      setAlertDialogMessage("Channel created successfully!");
      setShowAlertDialog(true);
      setTimeout(() => navigate(`/channel/${newChannel._id}`), 1500);
    } catch (err) {
      console.error("Channel creation failed:", err);
      const errorMessage = err.response?.data?.message || "Failed to create channel. Please try again.";
      setError(errorMessage);
      setAlertDialogMessage(errorMessage);
      setShowAlertDialog(true);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.channelId || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="create-channel-page p-4 md:p-8 text-white max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-gray-800 rounded-lg shadow-xl my-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Create Your Channel</h2>
      {error && <p className="text-red-500 text-center mb-4 text-sm md:text-base">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label htmlFor="channelName" className="block text-gray-300 text-sm md:text-base font-bold mb-2">Channel Name</label>
          <input
            type="text"
            id="channelName"
            className="w-full p-2 md:p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-300 text-sm md:text-base font-bold mb-2">Description</label>
          <textarea
            id="description"
            className="w-full p-2 md:p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 resize-y"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="channelBanner" className="block text-gray-300 text-sm md:text-base font-bold mb-2">Channel Banner</label>
          <input
            type="file"
            id="channelBanner"
            className="w-full p-2 md:p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm md:file:text-base file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            onChange={handleBannerChange}
            accept="image/*"
            required
          />
          {bannerPreview && (
            <div className="mt-4">
              <img src={bannerPreview} alt="Channel Banner Preview" className="w-full h-32 md:h-48 object-cover rounded-md" />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="channelAvatar" className="block text-gray-300 text-sm md:text-base font-bold mb-2">Channel Avatar</label>
          <input
            type="file"
            id="channelAvatar"
            className="w-full p-2 md:p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm md:file:text-base file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            onChange={handleAvatarChange}
            accept="image/*"
            required
          />
          {avatarPreview && (
            <div className="mt-4 flex justify-center">
              <img src={avatarPreview} alt="Channel Avatar Preview" className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 px-4 rounded-md transition-colors duration-200 shadow-lg"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Channel'}
        </button>
      </form>

      <CustomAlertDialog
        isOpen={showAlertDialog}
        message={alertDialogMessage}
        onConfirm={() => setShowAlertDialog(false)}
        showCancelButton={false}
      />
    </div>
  );
}

export default CreateChannelPage;