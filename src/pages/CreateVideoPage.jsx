import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CustomAlertDialog from '../components/CustomAlertDialog';
import LoadingSpinner from '../components/LoadingSpinner';

function CreateVideoPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');

  const categories = [
    'General',
    'Music',
    'Gaming',
    'News',
    'Education',
    'Sports',
    'Entertainment',
    'Technology',
    'React',
    'JavaScript',
    'Node.js',
    'MongoDB',
  ];

  const [receivedChannelData, setReceivedChannelData] = useState(null);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  useEffect(() => {
    if (location.state && location.state.channelData) {
      setReceivedChannelData(location.state.channelData);
    }

    const checkAuthAndChannel = async () => {
      if (!user) {
        setAlertDialogMessage('You must be logged in to upload videos.');
        setShowAlertDialog(true);
        setTimeout(() => navigate('/auth'), 1500);
        return;
      }

      const hasChannel =
        user.channelId ||
        (location.state && location.state.channelData && location.state.channelData._id);

      if (!hasChannel) {
        setAlertDialogMessage('You must create a channel before uploading videos.');
        setShowAlertDialog(true);
        setTimeout(() => navigate('/create-channel'), 1500);
        return;
      }

      setInitialCheckComplete(true);
    };

    checkAuthAndChannel();
  }, [user, navigate, location.state]);

  const handleFileChange = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    } else {
      setter(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!thumbnailFile || !videoFile) {
      const message = 'Please select both a thumbnail image and a video file.';
      setError(message);
      setAlertDialogMessage(message);
      setShowAlertDialog(true);
      setLoading(false);
      return;
    }

    const channelIdToUse = receivedChannelData?._id || user?.channelId;

    if (!channelIdToUse) {
      const message = 'Channel ID is missing. Cannot upload video.';
      setError(message);
      setAlertDialogMessage(message);
      setShowAlertDialog(true);
      setLoading(false);
      return;
    }

    if (!user?._id) {
      const message = 'Uploader ID is missing. User not authenticated correctly.';
      setError(message);
      setAlertDialogMessage(message);
      setShowAlertDialog(true);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('channel', channelIdToUse);
    formData.append('uploader', user._id);
    formData.append('thumbnailFile', thumbnailFile);
    formData.append('videoFile', videoFile);

    try {
      await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        },
      });

      setAlertDialogMessage('Video uploaded successfully!');
      setShowAlertDialog(true);
      setTimeout(() => navigate(`/channel/${channelIdToUse}`), 1500);
    } catch (err) {
      console.error('[Frontend] Video upload failed:', err);
      const errorMessage =
        err.response?.data?.message || 'Failed to upload video. Please try again.';
      setError(errorMessage);
      setAlertDialogMessage(errorMessage);
      setShowAlertDialog(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !initialCheckComplete) {
    return <LoadingSpinner />;
  }

  return (
    <div className="create-video-page p-4 md:p-8 text-white max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-gray-800 rounded-lg shadow-xl my-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Upload New Video</h2>
      {receivedChannelData && (
        <p className="text-center text-gray-300 mb-4 text-sm md:text-base">
          Uploading for channel: <span className="font-bold">{receivedChannelData.channelName}</span>
        </p>
      )}
      {error && <p className="text-red-500 text-center mb-4 text-sm md:text-base">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-300 text-sm md:text-base font-bold mb-2">
            Video Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-2 md:p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-300 text-sm md:text-base font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            className="w-full p-2 md:p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 resize-y"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            spellCheck="true"
          />
        </div>
        <div>
          <label htmlFor="thumbnailFile" className="block text-gray-300 text-sm md:text-base font-bold mb-2">
            Thumbnail Image
          </label>
          <input
            type="file"
            id="thumbnailFile"
            name="thumbnailFile"
            accept="image/*"
            className="w-full p-2 md:p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm md:file:text-base file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            onChange={handleFileChange(setThumbnailFile)}
            required
          />
        </div>
        <div>
          <label htmlFor="videoFile" className="block text-gray-300 text-sm md:text-base font-bold mb-2">
            Video File
          </label>
          <input
            type="file"
            id="videoFile"
            name="videoFile"
            accept="video/*"
            className="w-full p-2 md:p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm md:file:text-base file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            onChange={handleFileChange(setVideoFile)}
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-gray-300 text-sm md:text-base font-bold mb-2">
            Category
          </label>
          <select
            id="category"
            className="w-full p-2 md:p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 px-4 rounded-md transition-colors duration-200 shadow-lg"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Video'}
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

export default CreateVideoPage;