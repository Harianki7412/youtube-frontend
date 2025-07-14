import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CustomAlertDialog from '../components/CustomAlertDialog';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAlertDialogMessage('');

    try {
      if (isLogin) {
        await login(email, password);
        setAlertDialogMessage("Login successful!");
        setShowAlertDialog(true);
        setTimeout(() => navigate('/'), 1500);
      } else {
        await register(username, email, password);
        setAlertDialogMessage("Registration successful! You are now logged in.");
        setShowAlertDialog(true);
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Authentication failed. Please try again.';
      setError(errorMessage);
      setAlertDialogMessage(errorMessage);
      setShowAlertDialog(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-sm md:max-w-lg border border-gray-700">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
          {isLogin ? 'Sign In' : 'Register'}
        </h2>
        {error && <p className="text-red-500 text-center mb-4 text-sm md:text-base">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-300 text-sm md:text-base font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm md:text-base font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm md:text-base font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
            >
              {isLogin ? 'Sign In' : 'Register'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setUsername('');
                setEmail('');
                setPassword('');
              }}
              className="inline-block align-baseline font-bold text-sm md:text-base text-blue-500 hover:text-blue-800 transition-colors duration-200"
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Sign In'}
            </button>
          </div>
        </form>
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

export default AuthPage;