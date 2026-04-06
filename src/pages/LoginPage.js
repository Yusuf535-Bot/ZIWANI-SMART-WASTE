import React, { useState } from 'react';
import './LoginPage.css';
import { getImageUrl } from '../utils/imageAssets';
import { validateLogin, createUser } from '../utils/authUtils';
import ForgotPasswordModal from './ForgotPasswordModal';

function LoginPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    preferredName: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    location: '',
    age: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccessMessage('');
  };

  const validateForm = () => {
    if (isLogin) {
      // Login validation
      if (!formData.preferredName.trim() || !formData.password) {
        setError('Username and password are required');
        return false;
      }
    } else {
      // Signup validation
      if (!formData.fullName || !formData.phoneNumber || !formData.location || !formData.age || !formData.preferredName || !formData.password) {
        setError('All fields are required');
        return false;
      }

      const age = parseInt(formData.age);
      if (isNaN(age) || age < 8) {
        setError('You must be at least 8 years old');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      if (formData.preferredName.trim().length < 2) {
        setError('Preferred name must be at least 2 characters');
        return false;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { isLogin, formData }); // Debug log
    
    if (!validateForm()) {
      console.log('Form validation failed'); // Debug log
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login logic
        console.log('Attempting login...'); // Debug log
        const result = await validateLogin(formData.preferredName, formData.password);
        console.log('Login result:', result); // Debug log
        
        if (!result.success) {
          setError(result.error || 'Login failed. Please check your credentials.');
          setLoading(false);
          return;
        }

        // Successful login
        console.log('Login successful, calling onLoginSuccess'); // Debug log
        onLoginSuccess(result.user);
      } else {
        // Signup logic
        console.log('Attempting signup...'); // Debug log
        const result = await createUser({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
          age: parseInt(formData.age),
          preferredName: formData.preferredName,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        console.log('Signup result:', result); // Debug log
        
        if (!result.success) {
          setError(result.error || 'Signup failed. Please try again.');
          setLoading(false);
        return;
      }

      // Successful signup
        console.log('Signup successful, calling onLoginSuccess'); // Debug log
        onLoginSuccess(result.user);
      }
    } catch (err) {
      console.error('Error during auth:', err); // Debug log
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      preferredName: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phoneNumber: '',
      location: '',
      age: ''
    });
    setShowPassword(false);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={getImageUrl('logo')} alt="Ziwani Logo" className="login-logo-img" />
          <h1 className="login-title">Ziwani Smart Waste</h1>
          <p className="login-subtitle">Kisumu Plastic Waste Management for Taka Rangers</p>
        </div>

        <div className="login-content">
          {/* Toggle Buttons */}
          <div className="toggle-buttons">
            <button
              className={`toggle-btn ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
                resetForm();
              }}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`toggle-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
                resetForm();
              }}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {/* Login/Signup Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {isLogin ? (
              // LOGIN FORM
              <>
                <div className="form-group">
                  <label htmlFor="preferredName">Username/Preferred Name</label>
                  <input
                    type="text"
                    id="preferredName"
                    name="preferredName"
                    value={formData.preferredName}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    required
                  />
                  <p className="form-hint">Demo: eco_hero or green_guardian</p>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <p className="form-hint">Demo: password123 or demo2024</p>
                  <button 
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            ) : (
              // SIGNUP FORM
              <>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+254 7XX XXX XXX"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Kisumu Central"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="8+"
                      min="8"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="preferredName">Preferred Name (Username)</label>
                  <input
                    type="text"
                    id="preferredName"
                    name="preferredName"
                    value={formData.preferredName}
                    onChange={handleInputChange}
                    placeholder="e.g. eco_hero"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && <div className="error-message">{error}</div>}

            {successMessage && <div className="success-message">{successMessage}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="login-footer">
            <p className="demo-text">
              {isLogin ? 'Demo Accounts: eco_hero | green_guardian' : 'Minimum age: 8 years old'}
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => {
          setShowForgotPassword(false);
          setError('');
        }}
        onPasswordReset={() => {
          setSuccessMessage('✓ Password reset successfully! Please login with your new password.');
          setTimeout(() => {
            setSuccessMessage('');
            resetForm();
          }, 5000);
        }}
      />
    </div>
  );
}

export default LoginPage;
