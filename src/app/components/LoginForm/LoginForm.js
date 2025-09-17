'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './LoginForm.module.css';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl'; // Import for translations
import Button from '../Shared/Button';
import toast from 'react-hot-toast'; // Import toast for notifications
import classNames from 'classnames';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { usePathname } from 'next/navigation';

const Login = () => {
  const [loading, setLoading] = useState(false); // Loader state
  const [loginType, setLoginType] = useState('email'); // 'email' or 'mobile'
  const [phoneValue, setPhoneValue] = useState('');
  const searchParams = useSearchParams();
  const t = useTranslations('Login'); // Initialize translations
  const lang = useLocale(); // Get the current locale

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    resetField,
    setValue,
  } = useForm();
  const pathname = usePathname();

  // Improved refresh logic
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      sessionStorage.setItem('last_refreshed_path', currentPath);
    }
  }, [pathname]);

  const onSubmit = async (payload) => {
    setLoading(true);
    clearErrors();

    // Prepare login data based on tab
    let loginPayload = {
      password: payload.password,
      lang: lang,
      redirect: false,
    };

    if (loginType === 'email') {
      loginPayload.email = payload.email.toLowerCase();
    } else {
      let phone = payload.phone;
      if (phone && !phone.startsWith('+')) {
        phone = '+' + phone;
      }
      loginPayload.email = phone;
    }

    try {
      const result = await signIn('credentials', loginPayload);

      if (result.error) {
        setError('submit', { message: t('loginFailed') });
        toast.error(t('loginFailed'));
        setTimeout(() => clearErrors(), 3000);
      } else {
        const callbackUrl = searchParams.get('callbackUrl');
        window.location.href = callbackUrl ? callbackUrl : '/surveys';
      }
    } catch (error) {
      setError('submit', { message: t('loginFailed') });
      toast.error(t('loginFailed'));
      setTimeout(() => clearErrors(), 3000);
    } finally {
      setLoading(false);
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

  // New: Validate phone number using react-phone-input-2 value
  const validatePhone = (value) => {
    // react-phone-input-2 returns only digits if not valid
    if (!value || value.length < 8 || value.replace(/\D/g, '').length < 8) {
      return t('validEmailOrPhone');
    }
    return true;
  };

  // Handle "Enter" keypress to submit the form
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submit behavior
      handleSubmit(onSubmit)(); // Trigger the form submit
    }
  };

  // New: handle tab switch
  const handleTab = (type) => {
    setLoginType(type);
    clearErrors();
    if (type === 'email') {
      setPhoneValue('');
    } else {
      resetField('email');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>{t('loading')}</p>
            </div>
          </div>
        )}
        
        <div className={styles.formHeader}>
          <h2 className={styles.title}>{t('logIn')}</h2>
        </div>
        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <button
            type='button'
            className={classNames(
              styles.tab,
              loginType === 'mobile' && styles.activeTab,
            )}
            onClick={() => handleTab('mobile')}>
            {t('mobileTab') || 'Mobile Number'}
          </button>
          <button
            type='button'
            className={classNames(
              styles.tab,
              loginType === 'email' && styles.activeTab,
            )}
            onClick={() => handleTab('email')}>
            {t('emailTab') || 'Email'}
          </button>
        </div>
        <form
          className={`${styles.form} ${loading ? styles.formDisabled : ''}`}
          onSubmit={handleSubmit(onSubmit)}
          onKeyPress={handleKeyPress}>
          {/* Display request error */}
          {errors.submit && (
            <p role='alert' className={styles.error}>
              {errors.submit.message}
            </p>
          )}

          {/* Mobile Number Input */}
          {loginType === 'mobile' && (
            <div className={styles.formSection}>
              <div className={styles.inputGroup}>
                <PhoneInput
                  country={'ae'}
                  value={phoneValue}
                  onChange={(phone) => {
                    setPhoneValue(phone);
                    setValue('phone', phone);
                  }}
                  inputProps={{
                    name: 'phone',
                    required: true,
                    autoFocus: false,
                    disabled: loading,
                    placeholder:
                      t('mobilePlaceholder') || '+971 Enter Mobile Number',
                  }}
                  inputClass={classNames(
                    styles.phoneInput,
                    errors.phone && styles.errorBorder,
                    loading && styles.inputDisabled,
                  )}
                  buttonClass={styles.phoneButton}
                  containerClass={styles.phoneContainer}
                  dropdownClass={styles.phoneDropdown}
                  specialLabel=''
                  enableSearch
                />
                {loading && <div className={styles.inputSpinner}></div>}
              </div>
              {errors.phone && (
                <p role='alert' className={styles.error}>
                  {errors.phone.message}
                </p>
              )}
            </div>
          )}

          {/* Email Input */}
          {loginType === 'email' && (
            <div className={styles.formSection}>
              <div className={styles.inputGroup}>
                <input
                  type='email'
                  placeholder={t('emailOrPhone')}
                  className={classNames(
                    styles.input,
                    errors.email && styles.errorBorder,
                    loading && styles.inputDisabled,
                  )}
                  {...register('email', {
                    required: t('emailRequired'),
                    validate: validateEmailOrPhone,
                  })}
                  disabled={loading}
                />
                {loading && <div className={styles.inputSpinner}></div>}
              </div>
              {errors.email && (
                <p role='alert' className={styles.error}>
                  {errors.email.message}
                </p>
              )}
            </div>
          )}

          <div className={styles.formSection}>
            <div className={styles.inputGroup}>
              <input
                type='password'
                placeholder={t('password')}
                className={classNames(
                  styles.input,
                  errors.password && styles.errorBorder,
                  loading && styles.inputDisabled,
                )}
                {...register('password', { required: t('passwordRequired') })}
                disabled={loading}
              />
              {loading && <div className={styles.inputSpinner}></div>}
            </div>
            {errors.password && (
              <p role='alert' className={styles.error}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`${styles.submitButton} ${loading ? styles.submitButtonLoading : ''}`}
            disabled={loading}
          >
            {loading && <div className={styles.buttonSpinner}></div>}
            <span className={loading ? styles.buttonTextLoading : styles.buttonText}>
              {loading ? t('loading') : t('logIn')}
            </span>
          </button>
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
