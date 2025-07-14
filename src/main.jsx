
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Import createBrowserRouter and RouterProvider
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import HomePage from './pages/HomePage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import AuthPage from './pages/AuthPage';
import ChannelPage from './pages/ChannelPage';
import NotFoundPage from './pages/NotFoundPage';
import CreateVideoPage from './pages/CreateVideoPage';
import CreateChannelPage from './pages/CreateChannelPage';
import './index.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    errorElement: <NotFoundPage /> ,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "video/:videoId",
        element: <VideoPlayerPage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "channel/:channelId",
        element: <ChannelPage />,
      },
      {
        path: "create-video", //
        element: <CreateVideoPage />,
      },
      {
        path: "create-channel", //
        element: <CreateChannelPage />,
      }
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
