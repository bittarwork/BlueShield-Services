import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create a context for user-related data and functions
const UserContext = createContext();

// UserProvider component to manage user authentication state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [loading, setLoading] = useState(false); // Initially set loading to false
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Function to handle user login
  const login = async (email, password) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      setToken(token);
      setUser(userData);
      setIsAuthenticated(true);

      // Redirect user based on role
      switch (userData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'technician':
          navigate('/tech');
          break;
        default:
          navigate('/dashboard');
          break;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Optionally, handle the error by showing a message to the user
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to handle user registration
  const register = async (userData) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        userData
      );
      const { token, user: userDataResponse } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userDataResponse));
      localStorage.setItem('isAuthenticated', 'true');
      setToken(token);
      setUser(userDataResponse);
      setIsAuthenticated(true);
      navigate('/Login');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to handle user logout
  const logout = () => {
    setLoading(true); // Optionally, you can show loading during logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/'); // Redirect to home page after logout
    setLoading(false); // Stop loading
  };

  // Function to update user profile
  const updateProfile = async (updatedData) => {
    if (!user) {
      throw new Error('User is not authenticated');
    }
    setLoading(true); // Start loading
    try {
      const response = await axios.put(
        `${API_URL}/api/users/profile/${user._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to change user password
  const changePassword = async (oldPassword, newPassword) => {
    if (!user) {
      throw new Error('User is not authenticated');
    }
    setLoading(true); // Start loading
    try {
      await axios.put(
        `${API_URL}/api/users/change-password/${user._id}`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return 'Password changed successfully';
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to register an admin (admin-only)
  const registerAdmin = async (adminData) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        `${API_URL}/api/users/register-admin`,
        adminData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Register admin error:', error);
      throw error;
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to delete a user (admin-only)
  const deleteUser = async (userId) => {
    setLoading(true); // Start loading
    try {
      await axios.delete(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return 'User deleted successfully';
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Value object to be passed to the context provider
  const value = {
    user,
    isAuthenticated,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    registerAdmin,
    deleteUser,
  };

  // Provide the context value to all child components
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to access the UserContext
export const useUser = () => useContext(UserContext);
