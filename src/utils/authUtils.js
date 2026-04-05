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

// Mock functions for Forgot Password flow
export const sendOTPToPhone = (preferredName) => {
  // Mock implementation for demo purposes
  if (!preferredName) return { success: false, error: 'Username required' };
  return {
    success: true,
    phoneNumber: '+254 7XX XXX 123',
    otp: '1234',
    expiresIn: 300 // 5 minutes in seconds
  };
};

export const verifyOTP = (preferredName, otp) => {
  if (otp === '1234') {
    return { success: true };
  }
  return { success: false, error: 'Invalid OTP. Please try again.' };
};

export const resetPassword = (preferredName, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }
  return { success: true };
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

