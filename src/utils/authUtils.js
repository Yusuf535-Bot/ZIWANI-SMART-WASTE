// User authentication and data management
import { generateAvatarUrl } from './imageAssets';
import { authAPI } from './apiClient';

// Login function
export const validateLogin = async (preferredName, password) => {
  return await authAPI.login(preferredName, password);
};

// Create new user (signup)
export const createUser = async (userData) => {
  return await authAPI.signup(userData);
};

// Get current user
export const getCurrentUser = async () => {
  return await authAPI.getCurrentUser();
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  return await authAPI.updateProfile(profileData);
};

// Clear user session
export const logout = () => {
  authAPI.logout();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Get stored user data
export const getStoredUser = () => {
  const userStr = localStorage.getItem('takaRangerUser');
  return userStr ? JSON.parse(userStr) : null;
};

