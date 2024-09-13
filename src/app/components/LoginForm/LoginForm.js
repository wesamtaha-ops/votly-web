'use client';

import react, { useState } from 'react';
import Link from 'next/link';
import styles from './LoginForm.module.css';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl'; // Import for translations
import Button from '../Shared/Button';

const Login = () => {
  const [requestError, setRequestError] = useState('');
  const searchParams = useSearchParams();
  const t = useTranslations('Login'); // Initialize translations

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (payload) => {
    try {
      const { error, status } = await signIn('credentials', {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (error) {
        setError('submit', {
          message: t('loginFailed'),
        });
      } else {
        const callbackUrl = searchParams.get('callbackUrl');
        window.location.href = callbackUrl ? callbackUrl : '/';
      }
    } catch (error) {
      setRequestError(t('loginFailed'));
    }
  };

  const validateEmailOrPhone = (value) => {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const phonePattern = /^\+?\d{10,15}$/;
    if (emailPattern.test(value) || phonePattern.test(value)) {
      return true;
    }
    return t('validEmailOrPhone');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>{t('logIn')}</h2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
          />
          {errors.password && (
            <p role='alert' className={styles.error}>
              {errors.password.message}
            </p>
          )}

          <Button
            title={t('logIn')}
            onClick={handleSubmit(onSubmit)}
            style={{ fontFamily: 'Almarai', marginTop: 20 }}
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
