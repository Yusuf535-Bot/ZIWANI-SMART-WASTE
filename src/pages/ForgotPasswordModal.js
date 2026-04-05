import React, { useState } from 'react';
import './ForgotPasswordModal.css';
import { getImageUrl } from '../utils/imageAssets';
import { sendOTPToPhone, verifyOTP, resetPassword } from '../utils/authUtils';

function ForgotPasswordModal({ isOpen, onClose, onPasswordReset }) {
  const [step, setStep] = useState(1); // 1: Username, 2: OTP, 3: New Password
  const [preferredName, setPreferredName] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(''); // Demo only - remove in production
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Timer for OTP expiry
  React.useEffect(() => {
    if (step === 2 && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeRemaining]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    
    if (!preferredName.trim()) {
      setError('Please enter your username');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const result = sendOTPToPhone(preferredName);
      
      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setPhoneNumber(result.phoneNumber);
      setOtp(result.otp); // Demo only
      setTimeRemaining(result.expiresIn);
      setStep(2);
      setLoading(false);
      setError('');
    }, 800);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    
    if (!otpInput.trim() || otpInput.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    const result = verifyOTP(preferredName, otpInput);
    
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setStep(3);
    setLoading(false);
    setError('');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError('Please enter both password fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const result = resetPassword(preferredName, newPassword, confirmPassword);
    
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Success - notify parent and close modal
    setLoading(false);
    if (onPasswordReset) {
      onPasswordReset();
    }
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setPreferredName('');
    setOtpInput('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setOtp('');
    setTimeRemaining(0);
    onClose();
  };

  const handleResendOTP = () => {
    setOtpInput('');
    setError('');
    handleRequestOTP({ preventDefault: () => {} });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-forgot" onClick={handleClose}>
      <div className="modal-forgot-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-forgot-header">
          <h2>Reset Password</h2>
          <button className="modal-close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="modal-forgot-body">
          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="forgot-form">
              <div className="form-step-info">
                <p>Step 1 of 3: Enter Your Username</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="username">Username/Preferred Name</label>
                <input
                  type="text"
                  id="username"
                  value={preferredName}
                  onChange={(e) => {
                    setPreferredName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your username"
                  required
                />
              </div>

              {error && <div className="error-message-forgot">{error}</div>}

              <button type="submit" className="submit-btn-forgot" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP to Phone'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="forgot-form">
              <div className="form-step-info">
                <p>Step 2 of 3: Verify OTP</p>
              </div>

              <div className="otp-info">
                <p className="otp-message">
                  A 4-digit OTP has been sent to:
                </p>
                <p className="phone-number">{phoneNumber}</p>
                <div className="otp-demo-box">
                  <p className="demo-label">📱 Demo OTP:</p>
                  <p className="demo-otp">{otp}</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otpInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setOtpInput(val);
                    setError('');
                  }}
                  placeholder="0000"
                  maxLength="4"
                  required
                />
                <p className="otp-timer">
                  Expires in {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </p>
              </div>

              {error && <div className="error-message-forgot">{error}</div>}

              <button type="submit" className="submit-btn-forgot" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button 
                type="button" 
                className="resend-otp-btn"
                onClick={handleResendOTP}
                disabled={loading}
              >
                Didn't receive OTP? Resend
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="forgot-form">
              <div className="form-step-info">
                <p>Step 3 of 3: Create New Password</p>
              </div>

              <div className="success-checkmark">
                ✓
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  required
                />
                <p className="form-hint">At least 6 characters</p>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && <div className="error-message-forgot">{error}</div>}

              <button type="submit" className="submit-btn-forgot" disabled={loading}>
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
