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

// Send OTP to phone (demo implementation)
export const sendOTPToPhone = async (preferredName) => {
  // In a real app, this would call an SMS service
  // For demo purposes, generate a random 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Store OTP temporarily (in production, use a proper OTP service)
  localStorage.setItem(`otp_${preferredName}`, otp);
  localStorage.setItem(`otp_time_${preferredName}`, Date.now().toString());
  
  return {
    success: true,
    message: 'OTP sent successfully',
    otp: otp // Remove in production - only for demo
  };
};

// Verify OTP
export const verifyOTP = async (preferredName, enteredOtp) => {
  const storedOtp = localStorage.getItem(`otp_${preferredName}`);
  const otpTime = localStorage.getItem(`otp_time_${preferredName}`);
  
  if (!storedOtp || !otpTime) {
    return {
      success: false,
      error: 'OTP not found or expired'
    };
  }
  
  // Check if OTP is expired (5 minutes)
  const timeDiff = Date.now() - parseInt(otpTime);
  if (timeDiff > 5 * 60 * 1000) {
    localStorage.removeItem(`otp_${preferredName}`);
    localStorage.removeItem(`otp_time_${preferredName}`);
    return {
      success: false,
      error: 'OTP has expired'
    };
  }
  
  if (storedOtp === enteredOtp) {
    // Clear OTP after successful verification
    localStorage.removeItem(`otp_${preferredName}`);
    localStorage.removeItem(`otp_time_${preferredName}`);
    return {
      success: true,
      message: 'OTP verified successfully'
    };
  } else {
    return {
      success: false,
      error: 'Invalid OTP'
    };
  }
};

// Reset password
export const resetPassword = async (preferredName, newPassword) => {
  // In a real app, this would call the backend API
  // For demo, we'll simulate by updating local storage
  try {
    // This is a demo - in production, call authAPI.resetPassword
    const user = getStoredUser();
    if (user && user.preferredName === preferredName) {
      // Simulate password reset
      return {
        success: true,
        message: 'Password reset successfully'
      };
    } else {
      return {
        success: false,
        error: 'User not found'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to reset password'
    };
  }
};

