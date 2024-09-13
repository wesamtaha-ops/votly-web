'use client';

import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './OtpVerification.module.css';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { callApi } from '../../helper';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl'; // Import for translations

const OtpVerification = ({ contactInfo, type }) => {
  const t = useTranslations('OtpVerification'); // Initialize translations
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  const handleInputChange = (index, event) => {
    const value = event.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const resendOtp = async () => {
    await callApi({
      type: 'post',
      url: 'resendOtp',
      userToken: session?.id,
    });

    toast.success(t('otpSent'));
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 6) {
      toast(t('enterValidOtp'));
      return;
    }

    const response = await callApi({
      type: 'post',
      url: type == 'email' ? 'emailVerify' : 'mobileVerify',
      data: { code: enteredOtp },
      userToken: session?.id,
    });

    if (response.status == 200) {
      toast.success(t('otpVerified'));
      await updateSession({ user: response.data });
      router.push(type == 'email' ? '/mobile-verification' : '/');
    } else {
      toast.error(t('invalidOtp'));
    }
  };

  return (
    <div className={styles.otpContainer}>
      <div className={styles.card}>
        {type == 'mobile' && (
          <img
            src='https://static.vecteezy.com/system/resources/previews/025/674/495/non_2x/verification-otp-one-time-password-has-been-send-input-code-with-smartphone-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg'
            alt='otp'
            className={styles.otpImage}
          />
        )}
        {type == 'email' && (
          <img
            src='https://blog.typingdna.com/wp-content/uploads/2021/11/email_OTP.jpg'
            alt='otp'
            className={styles.otpImage}
          />
        )}
        <h2 className={styles.title}>
          {t('enterCode')} <br /> {contactInfo}
        </h2>
        <div dir='ltr' className={styles.otpInputs}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type='text'
              maxLength='1'
              className={styles.otpInput}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleInputChange(index, e)}
            />
          ))}
        </div>
        <button className={styles.submitButton} onClick={handleSubmit}>
          {t('submit')}
        </button>
        <button className={styles.btnResend} onClick={resendOtp}>
          {t('resendOtp')}
        </button>
      </div>
    </div>
  );
};

OtpVerification.propTypes = {
  contactInfo: PropTypes.string.isRequired,
};

export default OtpVerification;
