'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './LoginForm.module.css';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl'; // Import for translations
import Button from '../Shared/Button';
import toast from 'react-hot-toast'; // Import toast for notifications

const Login = () => {
  const [requestError, setRequestError] = useState('');
  const [loading, setLoading] = useState(false); // Loader state
  const searchParams = useSearchParams();
  const t = useTranslations('Login'); // Initialize translations

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm();

  const onSubmit = async (payload) => {
    setLoading(true); // Start loading
    try {
      const { error } = await signIn('credentials', {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (error) {
        setError('submit', {
          message: t('loginFailed'),
        });
        toast.error(t('loginFailed')); // Show error toast
      } else {
        const callbackUrl = searchParams.get('callbackUrl');
        window.location.href = callbackUrl ? callbackUrl : '/';
      }
    } catch (error) {
      setRequestError(t('loginFailed'));
      toast.error(t('loginFailed')); // Show error toast
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const validateEmailOrPhone = (value) => {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const phonePattern = /^\+?\d{10,15}$/;

    // If it's a phone number but doesn't start with +, add it
    if (phonePattern.test(value) && !value.startsWith('+')) {
      return `+${value}`;
    }

    if (emailPattern.test(value) || phonePattern.test(value)) {
      return true;
    }

    return t('validEmailOrPhone');
  };

  // Handle "Enter" keypress to submit the form
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submit behavior
      handleSubmit(onSubmit)(); // Trigger the form submit
    }
  };

  return (
    <div
      className={styles.loginContainer}
      style={{ opacity: loading ? 0.5 : 1 }}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>{t('logIn')}</h2>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          onKeyPress={handleKeyPress} // Listen for "Enter" keypress
        >
          {requestError && (
            <p role='alert' className={styles.error}>
              {requestError}
            </p>
          )}

          <input
            type='text'
            placeholder={t('emailOrPhone')}
            className={`${styles.input} ${
              errors.email ? styles.errorBorder : ''
            }`}
            {...register('email', {
              required: t('emailRequired'),
              validate: validateEmailOrPhone,
            })}
            disabled={loading} // Disable input when loading
          />
          {errors.email && (
            <p role='alert' className={styles.error}>
              {errors.email.message}
            </p>
          )}

          <input
            type='password'
            placeholder={t('password')}
            className={`${styles.input} ${
              errors.password ? styles.errorBorder : ''
            }`}
            {...register('password', { required: t('passwordRequired') })}
            disabled={loading} // Disable input when loading
          />
          {errors.password && (
            <p role='alert' className={styles.error}>
              {errors.password.message}
            </p>
          )}

          <Button
            title={loading ? t('loading') : t('logIn')} // Show "loading..." while submitting
            style={{ fontFamily: 'Almarai', marginTop: 20 }}
            disabled={loading} // Disable button when loading
          />
        </form>
        <br />
        <Link href='/forgot-password' className={styles.forgotPasswordLink}>
          {t('forgotPassword')}
        </Link>
        <br />
        <br />
        <Link href='/register' className={styles.forgotPasswordLink}>
          {t('register')}
        </Link>
      </div>
    </div>
  );
};

export default Login;
