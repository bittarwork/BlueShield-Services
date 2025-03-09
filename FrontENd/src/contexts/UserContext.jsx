import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create a context for user-related data and functions
const UserContext = createContext();

// Custom hook to access the UserContext
export const useUser = () => useContext(UserContext);

// UserProvider component to manage user authentication state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to store user data
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication status
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Function to handle user login
  const login = async (email, password) => {
    try {
      // Send a POST request to the login endpoint
      const response = await axios.post(
        `${process.env.API_URL}/api/users/login`,
        { email, password }
      );
      const { token, user: userData } = response.data;

      // Store the token in localStorage
      localStorage.setItem("token", token);
      setUser(userData); // Update user state
      setIsAuthenticated(true); // Set authentication status to true
      return userData; // Return user data for further use
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Propagate the error to the caller
    }
  };

  // Function to handle user registration
  const register = async (userData) => {
    try {
      // Send a POST request to the registration endpoint
      const response = await axios.post(
        `${process.env.API_URL}/api/users/register`,
        userData
      );
      const { token, user: userDataResponse } = response.data;

      // Store the token in localStorage
      localStorage.setItem("token", token);
      setUser(userDataResponse); // Update user state
      setIsAuthenticated(true); // Set authentication status to true
      return userDataResponse; // Return user data for further use
    } catch (error) {
      console.error("Registration failed:", error);
      throw error; // Propagate the error to the caller
    }
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setUser(null); // Clear user state
    setIsAuthenticated(false); // Set authentication status to false
  };

  // Function to fetch user data from the server
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Send a GET request to the profile endpoint with the token
        const response = await axios.get(
          `${process.env.API_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(response.data); // Update user state
        setIsAuthenticated(true); // Set authentication status to true
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token"); // Remove invalid token
      }
    }
    setLoading(false); // Set loading state to false
  };

  // Function to update user profile
  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.API_URL}/api/users/profile/${user._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data); // Update user state with new data
      return response.data; // Return updated user data
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  // Function to change user password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.API_URL}/api/users/change-password/${user._id}`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return "Password changed successfully";
    } catch (error) {
      console.error("Failed to change password:", error);
      throw error;
    }
  };

  // Function to register an admin (admin-only)
  const registerAdmin = async (adminData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.API_URL}/api/users/register-admin`,
        adminData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data; // Return the new admin data
    } catch (error) {
      console.error("Failed to register admin:", error);
      throw error;
    }
  };

  // Function to delete a user (admin-only)
  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return "User deleted successfully";
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUser();
  }, []);

  // Value object to be passed to the context provider
  const value = {
    user,
    isAuthenticated,
    loading,
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
