'use client';

import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './OtpVerification.module.css';

const OtpVerification = ({ contactInfo }) => {
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (index, event) => {
    const value = event.target.value;
    if (/^[0-9]$/.test(value)) {
      // Only allow digits
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    } else if (value.length > 1) {
      // Handle paste event
      handlePaste(index, value);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputsRef.current[index - 1].focus();
      }
    } else if (/^[0-9]$/.test(event.key)) {
      const newOtp = [...otp];
      newOtp[index] = event.key;
      setOtp(newOtp);
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
      event.preventDefault(); // Prevent double typing
    }
  };

  const handlePaste = (index, value) => {
    const newOtp = [...otp];
    const digits = value.slice(0, 4 - index).split('');
    digits.forEach((digit, i) => {
      newOtp[index + i] = digit;
    });
    setOtp(newOtp);
    // Focus on the last filled input
    const nextIndex = index + digits.length - 1;
    if (nextIndex < inputsRef.current.length) {
      inputsRef.current[nextIndex].focus();
    }
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === '1111') {
      setMessage('OTP verified successfully!');
      setIsSuccess(true);
    } else {
      setMessage('Invalid OTP. Please try again.');
      setIsSuccess(false);
    }
  };

  return (
    <div className={styles.otpContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          Enter the 4-digit code sent to {contactInfo}
        </h2>
        <div className={styles.otpInputs}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type='text'
              maxLength='1'
              className={styles.otpInput}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
        {message && (
          <p
            className={`${styles.message} ${
              isSuccess ? styles.success : styles.error
            }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

OtpVerification.propTypes = {
  contactInfo: PropTypes.string.isRequired,
};

export default OtpVerification;
