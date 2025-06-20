// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import BookRecommendation from './components/BookRecommendation';
import TrendingBooks from './components/TrendingBooks';
import FullScreenReader from './components/FullScreenReader';

// 🔒 Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

// 🧠 Dashboard component with Dark Mode Toggle
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <div className={`min-h-screen p-4 transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-50 via-white to-blue-50 text-black'}`}>
      
      {/* 🔝 Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-purple-600">BookHub</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300 transition"
              >
                {darkMode ? '🌙 Dark' : '☀️ Light'}
              </button>
              <span>{user?.email}</span>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 📚 Main Dashboard Content */}
      <main className="mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TrendingBooks />
          <BookRecommendation />
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatePresence mode="wait">
          <div className="App">
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/read/:bookId"
                element={
                  <ProtectedRoute>
                    <FullScreenReader />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
}

export default App;

